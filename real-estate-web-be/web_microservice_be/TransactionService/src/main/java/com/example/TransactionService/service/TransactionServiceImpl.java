package com.example.TransactionService.service;

import com.example.TransactionService.dto.EmailNotificationDTO;
import com.example.TransactionService.dto.UserCreatedDTO;
import com.example.TransactionService.exception.AppException;
import com.example.TransactionService.exception.ErrorCode;
import com.example.TransactionService.mapper.TransactionMapper;
import com.example.TransactionService.model.ProcessedTransaction;
import com.example.TransactionService.model.Transaction;
import com.example.TransactionService.model.Wallet;
import com.example.TransactionService.repository.ProcessedTransactionRepository;
import com.example.TransactionService.repository.TransactionRepository;
import com.example.TransactionService.repository.WalletRepository;
import com.example.TransactionService.request.PurchaseRequest;
import com.example.TransactionService.request.TopUpRequest;
import com.example.TransactionService.response.PurchaseResponse;
import com.example.TransactionService.response.TopUpResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionService {
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final RabbitTemplate rabbitTemplate;
    private final TransactionMapper transactionMapper;
    private final ProcessedTransactionRepository processedTransactionRepository;

    // RabbitMQ Config
    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing-key.user-top-up}")
    private String transactionTopUpRoutingKey;


    @RabbitListener(queues = "${rabbitmq.queue.user}")
    @Transactional
    public void handleUserCreated(UserCreatedDTO userCreatedDTO) {
        log.info("Nhận được sự kiện User Created: {}", userCreatedDTO);

        try {
            Wallet check = createWallet(userCreatedDTO.userId(), userCreatedDTO.email());
            log.info("Đã tạo wallet cho user: {}", userCreatedDTO.userId());
        } catch (Exception e){
            log.info("Lỗi khi tạo wallet cho user: {}", userCreatedDTO.userId());
        }
    }

    @Override
    @Transactional
    public TopUpResponse topUpWallet(Long userId, TopUpRequest topUpRequest) {
        log.info("Xử lý nạp tiền cho user {}: {}", userId, topUpRequest.amount());

        // 1. Tìm ví của user, nếu chưa có thì tạo mới
        Wallet userWallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> createWallet(userId, topUpRequest.email()));

        if(!Objects.equals(userWallet.getEmail(), topUpRequest.email())) {
            log.warn("Email trong yêu cầu nạp tiền không khớp với email ví của user {}.", userId);
            throw new IllegalArgumentException("Email trong yêu cầu nạp tiền không khớp với email ví.");
        }

        // 2. Tạo giao dịch (Transaction) ở trạng thái PENDING
        Transaction transaction = Transaction.builder()
                .userId(userId)
                .email(topUpRequest.email())
                .userName(topUpRequest.userName())
                .amount(topUpRequest.amount())
                .transactionType(Transaction.TransactionType.TOP_UP)
                .paymentMethod(topUpRequest.paymentMethod())
                .status(Transaction.Status.PENDING) //
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        transactionRepository.save(transaction);
        log.info("Đã tạo giao dịch PENDING: {}", transaction.getId());

        // 3. === GIẢ LẬP THANH TOÁN THÀNH CÔNG ===
        // (Trong thực tế, đây là lúc gọi API thanh toán và chờ callback)

        // 4. Cập nhật số dư ví
        userWallet.setBalance(userWallet.getBalance() + topUpRequest.amount());
        userWallet.setUpdatedAt(LocalDateTime.now());
        Wallet savedWallet = walletRepository.save(userWallet);

        // 5. Cập nhật giao dịch sang COMPLETED
        transaction.setStatus(Transaction.Status.COMPLETED); //
        transaction.setUpdatedAt(LocalDateTime.now());
        Transaction savedTransaction =  transactionRepository.save(transaction);

        log.info("Đã nạp tiền thành công cho user {}, số dư mới: {}", userId, savedWallet.getBalance());

        try{
            EmailNotificationDTO emailNotificationDTO = new EmailNotificationDTO(
                    savedTransaction.getEmail(),
                    "Top up successful",
                    "TOP_UP_EMAIL",
                    savedTransaction.getUserId(),
                    Map.of("user_name", savedTransaction.getUserName(),
                            "transaction_id", savedTransaction.getId(),
                            "amount", savedTransaction.getAmount(),
                            "payment_method", savedTransaction.getPaymentMethod(),
                            "updatedAt", savedTransaction.getUpdatedAt().toString(),
                            "new_balance", savedWallet.getBalance()
                            )
            );

            rabbitTemplate.convertAndSend(
                    exchangeName,
                    transactionTopUpRoutingKey,
                    emailNotificationDTO
            );

            log.info("Sent 'top up' message to RabbitMQ for user: {}", savedTransaction.getEmail());
        } catch (Exception e) {
            log.error("Failed to send 'top up' message for user {}: {}", savedTransaction.getEmail(), e.getMessage());
        }

        return transactionMapper.toTopUpResponse(savedTransaction, savedWallet);
    }

    @Override
    @Transactional
    public Wallet getWalletByUserId(Long userId) {
        return walletRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.WALLET_NOT_FOUND));
    }

    @Override
    public Page<Transaction> getTransactionHistoryByType(Long userId, Transaction.TransactionType type, Pageable pageable) {
        return transactionRepository.findByUserIdAndTransactionType(userId, type, pageable);
    }

    @Override
    public Page<Transaction> getAllTransactionHistoryByUserId(Long userId, Pageable pageable) {
        return transactionRepository.findByUserId(userId, pageable);
    }

    @Override
    public Page<Transaction> getAllTopUpTransactions(String search,
                                                     Transaction.Status status,
                                                     LocalDate startDate,
                                                     LocalDate endDate,
                                                     Pageable pageable) {
        Specification<Transaction> spec = Specification.where(isTopUp());

        // 2. Thêm filter Status (nếu có)
        if (status != null) {
            spec = spec.and(byStatus(status));
        }

        // 3. Thêm filter Ngày (nếu có)
        if (startDate != null) {
            spec = spec.and(byDateRange(startDate, endDate));
        }

        // 4. Thêm filter Search (nếu có)
        if (StringUtils.hasText(search)) {
            spec = spec.and(searchByKeyword(search));
        }

        // 5. Thực thi truy vấn
        return transactionRepository.findAll(spec, pageable);
    }

    @Override
    @Transactional
    public PurchaseResponse processPurchase(Long userId, PurchaseRequest purchaseRequest) {
        log.info("Xử lý yêu cầu mua hàng cho OrderID: {}", purchaseRequest.subscriptionOrderId());

        // 1. KIỂM TRA IDEMPOTENCY (Chống trùng lặp)
        Optional<ProcessedTransaction> existingTransaction = processedTransactionRepository.findById(purchaseRequest.subscriptionOrderId());

        if (existingTransaction.isPresent()) {
            log.warn("OrderID: {} đã được xử lý. Trả về giao dịch cũ.", purchaseRequest.subscriptionOrderId());
            // Nếu đã xử lý, trả về kết quả cũ mà không trừ tiền lại
            Transaction oldTransaction = transactionRepository.findById(existingTransaction.get().getTransactionId())
                    .orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_NOT_FOUND));

            return PurchaseResponse.builder().
                    transactionId(oldTransaction.getId()).
                    userId(oldTransaction.getUserId()).
                    email(oldTransaction.getEmail()).
                    userName(oldTransaction.getUserName()).
                    amount(oldTransaction.getAmount()).
                    status(oldTransaction.getStatus()).
                    createdAt(oldTransaction.getCreatedAt()).
                    subscriptionOrderId(purchaseRequest.subscriptionOrderId()).
                    build();
        }

        // 2. TÌM VÍ VÀ KHÓA (Pessimistic Lock)
        // (Giả sử WalletRepository đã có findByUserId với @Lock)
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.WALLET_NOT_FOUND));

        if(!Objects.equals(wallet.getEmail(), purchaseRequest.email())) {
            log.warn("Email trong yêu cầu mua hàng không khớp với email ví của user {}.", userId);
            throw new IllegalArgumentException("Email trong yêu cầu mua hàng không khớp với email ví.");
        }

        // 3. XỬ LÝ THANH TOÁN
        if (wallet.getBalance() >= purchaseRequest.amount()) {
            // 3.1. THÀNH CÔNG: Đủ tiền
            log.info("Ví đủ tiền. Trừ tiền cho User {}", userId);
            wallet.setBalance(wallet.getBalance() - purchaseRequest.amount());
            wallet.setUpdatedAt(LocalDateTime.now());
            walletRepository.save(wallet);

            Transaction transaction = Transaction.builder()
                    .userId(userId)
                    .email(purchaseRequest.email())
                    .userName(purchaseRequest.userName())
                    .transactionType(Transaction.TransactionType.PURCHASE_SUBSCRIPTION)
                    .amount(purchaseRequest.amount() * -1) // Ghi âm
                    .status(Transaction.Status.COMPLETED)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            Transaction savedTransaction = transactionRepository.save(transaction);

            // Lưu vào bảng đã xử lý để chống trùng lặp
            ProcessedTransaction processedTransaction = ProcessedTransaction.builder()
                    .subscriptionOrderId(purchaseRequest.subscriptionOrderId())
                    .transactionId(savedTransaction.getId())
                    .subscriptionName(purchaseRequest.subscriptionName())
                    .subscriptionId(purchaseRequest.subscriptionId())
                    .createdAt(LocalDateTime.now())
                    .build();

            ProcessedTransaction savedProcessedTransaction = processedTransactionRepository.save(processedTransaction);

            PurchaseResponse response = PurchaseResponse.builder().
                    transactionId(savedTransaction.getId()).
                    userId(savedTransaction.getUserId()).
                    email(savedTransaction.getEmail()).
                    userName(savedTransaction.getUserName()).
                    amount(savedTransaction.getAmount()).
                    status(savedTransaction.getStatus()).
                    createdAt(savedTransaction.getCreatedAt()).
                    subscriptionOrderId(savedProcessedTransaction.getSubscriptionOrderId()).
                    build();
            log.info("Mua hàng thành công cho OrderID: {}. Giao dịch ID: {}", purchaseRequest.subscriptionOrderId(), savedTransaction.getId());
            return response;

        } else {
            // 3.2. THẤT BẠI: Không đủ tiền
            log.warn("Ví KHÔNG đủ tiền cho User {}. Số dư: {}", userId, wallet.getBalance());

            // Ném lỗi để Controller trả về 400
            throw new AppException(ErrorCode.INSUFFICIENT_FUNDS); // (Bạn cần tự định nghĩa ErrorCode này)
        }
    }

    // Luôn lọc giao dịch TOP_UP
    private Specification<Transaction> isTopUp() {
        return (root, query, cb) -> cb.equal(root.get("transactionType"), Transaction.TransactionType.TOP_UP);
    }

    // Lọc theo Status
    private Specification<Transaction> byStatus(Transaction.Status status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    // Lọc theo khoảng ngày
    private Specification<Transaction> byDateRange(LocalDate startDate, LocalDate endDate) {
        return (root, query, cb) -> {
            LocalDateTime start = startDate.atStartOfDay();
            // Nếu không có endDate, mặc định tìm trong ngày startDate
            LocalDateTime end = (endDate != null) ? endDate.plusDays(1).atStartOfDay() : startDate.plusDays(1).atStartOfDay();
            return cb.between(root.get("createdAt"), start, end);
        };
    }

    // Lọc theo search (email, transaction_id, user_id)
    private Specification<Transaction> searchByKeyword(String search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            String likePattern = "%" + search.toLowerCase() + "%";

            // Search theo email
            predicates.add(cb.like(cb.lower(root.get("email")), likePattern));

            // Thử search theo ID (nếu search là số)
            try {
                Long idValue = Long.parseLong(search);
                // Search theo transaction_id
                predicates.add(cb.equal(root.get("id"), idValue));
                // Search theo user_id
                predicates.add(cb.equal(root.get("userId"), idValue));
            } catch (NumberFormatException e) {
                // Nếu không phải số, bỏ qua search theo ID
            }

            // Kết hợp các điều kiện search bằng OR
            return cb.or(predicates.toArray(new Predicate[0]));
        };
    }


    @Transactional
    protected Wallet createWallet(Long userId, String email) {
        try {
            Optional<Wallet> existingWallet = walletRepository.findByUserId(userId);

            if (existingWallet.isPresent()) {
                log.info("User {} đã có wallet, không tạo mới.", userId);
                return null;
            }

            Wallet newWallet = Wallet.builder()
                    .userId(userId)
                    .email(email)
                    .balance(0.0)
                    .updatedAt(LocalDateTime.now())
                    .build();

            log.info("Đã tạo wallet cho user {}", userId);
            return walletRepository.save(newWallet);

        } catch (Exception e) {
            log.error("Lỗi khi tạo wallet cho user {}: {}", userId, e.getMessage());
            return null;
        }
    }
}

package com.example.TransactionService.service;

import com.example.TransactionService.dto.UserCreatedDTO;
import com.example.TransactionService.model.Transaction;
import com.example.TransactionService.model.Wallet;
import com.example.TransactionService.repository.TransactionRepository;
import com.example.TransactionService.repository.WalletRepository;
import com.example.TransactionService.request.TopUpRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionService {
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    @Override
    @RabbitListener(queues = "${rabbitmq.queue.user}")
    public void handleUserCreated(UserCreatedDTO userCreatedDTO) {
        log.info("Nhận được sự kiện User Created: {}", userCreatedDTO);

        try {
            Wallet check = createWallet(userCreatedDTO.userId());
            log.info("Đã tạo wallet cho user: {}", userCreatedDTO.userId());
        } catch (Exception e){
            log.info("Lỗi khi tạo wallet cho user: {}", userCreatedDTO.userId());
        }
    }

    @Override
    public Wallet topUpWallet(Long userId, TopUpRequest topUpRequest) {
        log.info("Xử lý nạp tiền cho user {}: {}", userId, topUpRequest.amount());

        // 1. Tìm ví của user, nếu chưa có thì tạo mới
        Wallet userWallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> createWallet(userId));

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
        transactionRepository.save(transaction);

        log.info("Đã nạp tiền thành công cho user {}, số dư mới: {}", userId, savedWallet.getBalance());
        return savedWallet;
    }


    @Transactional
    protected Wallet createWallet(Long userId) {
        try {
            Optional<Wallet> existingWallet = walletRepository.findByUserId(userId);

            if (existingWallet.isPresent()) {
                log.info("User {} đã có wallet, không tạo mới.", userId);
                return null;
            }

            Wallet newWallet = Wallet.builder()
                    .userId(userId)
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

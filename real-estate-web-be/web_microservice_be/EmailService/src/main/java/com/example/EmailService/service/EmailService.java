package com.example.EmailService.service;

import com.example.EmailService.dto.EmailNotificationDTO;
import com.example.EmailService.model.Email;
import com.example.EmailService.repository.EmailRepository;
import com.example.EmailService.utils.EmailFormatUtils;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender emailSender;
    private final EmailRepository emailRepository;
    private final TemplateEngine templateEngine;

    private boolean sendEmail(String to, String subject, String body) {
        log.info("Đang gửi email tới: {}, chủ đề: {}", to, subject);
        try{
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            emailSender.send(message);
            log.info("Gửi email thành công tới: {}", to);
            return true;
        } catch (Exception e) {
            log.error("Lỗi khi gửi email tới: {}, lỗi: {}", to, e.getMessage());
            return false;
        }
    }

    /**
     * Bổ sung hàm lưu log vào database
     */
    private void saveEmailLog(EmailNotificationDTO dto, String body) {
        try {
            Email email = new Email();
            email.setEmailReceiver(dto.to());
            email.setSubject(dto.subject());
            email.setBody(body);
            email.setUserId(dto.userId());
            email.setCreatedAt(LocalDateTime.now());

            emailRepository.save(email);
            log.info("Đã lưu log email vào CSDL cho user {}", dto.userId());
        } catch (Exception e) {
            log.error("Lỗi khi lưu log email: {}", e.getMessage());
        }
    }

    @RabbitListener(queues = "${rabbitmq.queue.user}")
    public void handleUserEmail(EmailNotificationDTO emailDto) {
        log.info("Nhận tác vụ email USER: {} cho {}", emailDto.template(), emailDto.to());

        String body = "";
        String subject = emailDto.subject();

        Context context = new Context();
        context.setVariable("data", emailDto.data());
        context.setVariable("to", emailDto.to());

        switch (emailDto.template()) {
            case "WELCOME_EMAIL":
                body = templateEngine.process("user/welcome", context);
                break;

            case "FORGOT_PASSWORD_OTP":
                body = templateEngine.process("user/forgot-password-otp", context);
                break;

            default:
                log.error("Không nhận dạng được template: {}", emailDto.template());
                return;
        }

        boolean sent = sendEmail(emailDto.to(), subject, body);

        if (sent) {
            saveEmailLog(emailDto, body);
        }
    }

    @RabbitListener(queues = "${rabbitmq.queue.transaction}")
    public void handleTransactionEmail(EmailNotificationDTO emailDto) {
        log.info("Nhận tác vụ email GIAO DỊCH: {} cho {}", emailDto.template(), emailDto.to());

        String body = "";
        String subject = emailDto.subject();

        // Format data cho template
        Map<String, Object> raw_data = emailDto.data();

        Map<String, Object> formatted = new HashMap<>(raw_data);

        formatted.put("amount", EmailFormatUtils.vnd(raw_data.get("amount")));
        formatted.put("new_balance", EmailFormatUtils.vnd(raw_data.get("new_balance")));
        formatted.put("updatedAt", EmailFormatUtils.date(LocalDateTime.parse((String) raw_data.get("updatedAt"))));

        Context context = new Context();
        context.setVariable("data", formatted);
        context.setVariable("to", emailDto.to());

        switch (emailDto.template()) {
            case "TOP_UP_EMAIL":
                body = templateEngine.process("transaction/top-up", context);
                break;
            default:
                log.error("Không nhận dạng được template: {}", emailDto.template());
                return;
        }

        boolean sent = sendEmail(emailDto.to(), subject, body);

        if (sent) {
            saveEmailLog(emailDto, body);
        }
    }

    @RabbitListener(queues = "${rabbitmq.queue.subscription}")
    public void handleSubscriptionEmail(EmailNotificationDTO emailDto) {
        log.info("Nhận tác vụ email MUA SUBSCRIPTION: {}", emailDto.to());

        String body = "";
        String subject = emailDto.subject();

        // Format data cho template
        Map<String, Object> raw_data = emailDto.data();

        Map<String, Object> formatted = new HashMap<>(raw_data);

        if (raw_data.get("amount") != null) {
            formatted.put("amount", EmailFormatUtils.vnd(raw_data.get("amount")));
        }

        if (raw_data.get("price") != null) {
            formatted.put("price", EmailFormatUtils.vnd(raw_data.get("price")));
        }

        // --- FORMAT DATETIME ---
        if (raw_data.get("updatedAt") != null) {
            formatted.put("updatedAt",
                    EmailFormatUtils.date(LocalDateTime.parse((String) raw_data.get("updatedAt"))));
        }

        if (raw_data.get("startDate") != null) {
            formatted.put("startDate",
                    EmailFormatUtils.date(LocalDateTime.parse((String) raw_data.get("startDate"))));
        }

        if (raw_data.get("endDate") != null) {
            formatted.put("endDate",
                    EmailFormatUtils.date(LocalDateTime.parse((String) raw_data.get("endDate"))));
        }
        Context context = new Context();
        context.setVariable("data", formatted);
        context.setVariable("to", emailDto.to());

        switch (emailDto.template()) {
            case "PURCHASE_SUBSCRIPTION_EMAIL":
                body = templateEngine.process("subscription/subscription-purchase-success", context);
                break;
            default:
                log.error("Không nhận dạng được template: {}", emailDto.template());
                return;
        }

        boolean sent = sendEmail(emailDto.to(), subject, body);

        if (sent) {
            saveEmailLog(emailDto, body);
        }
    }

    @RabbitListener(queues = "${rabbitmq.queue.property}")
    public void handlePropertyEmail(EmailNotificationDTO emailDto) {
        log.info("Nhận tác vụ email BẤT ĐỘNG SẢN: {}", emailDto.to());
        // ... (Tương tự, tạo template cho tin đăng)
    }
}
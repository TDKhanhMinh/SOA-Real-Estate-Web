package com.example.SubscriptionService.service;

import com.example.SubscriptionService.dto.UserCreatedDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {


    @Override
    @RabbitListener(queues = "${rabbitmq.queue.user}")
    public void handleUserCreated(UserCreatedDTO userCreatedDTO) {
        log.info("Nhận được sự kiện User Created: {}", userCreatedDTO);
        log.info("Đã tạo subscription cho user: {}", userCreatedDTO.userId());
    }
}

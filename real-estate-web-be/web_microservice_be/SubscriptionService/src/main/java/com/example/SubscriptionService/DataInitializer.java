package com.example.SubscriptionService;

import com.example.SubscriptionService.model.Subscription;
import com.example.SubscriptionService.repository.SubscriptionRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
@RequiredArgsConstructor
public class DataInitializer {
    private final SubscriptionRepository subscriptionRepository;

    @Bean
    CommandLineRunner loadData() {
        return args -> {
            loadSubscription();
        };
    }

    private void loadSubscription() {
        if (subscriptionRepository.count() == 0) {
            subscriptionRepository.save(
                    Subscription.builder()
                            .name("Basic")
                            .description("Gói cơ bản với các tính năng giới hạn.")
                            .price(0.0)
                            .duration(36500) // 100 năm
                            .maxPost(5) // Tối đa 5 bài viết
                            .postExpiryDays(7) // Bài viết hết hạn sau 7 ngày
                            .priority(5) // Ưu tiên thấp nhất
                            .build()
            );

            subscriptionRepository.save(
                    Subscription.builder()
                            .name("Premium")
                            .description("Gói Premium với các tính năng nâng cao.")
                            .price(999000.0)
                            .duration(30) // 30 ngày
                            .maxPost(50) // Tối đa 30 bài viết
                            .postExpiryDays(30) // Bài viết hết hạn sau 30 ngày
                            .priority(3) // Ưu tiên trung bình
                            .build()
            );

            subscriptionRepository.save(
                    Subscription.builder()
                            .name("Enterprise")
                            .description("Gói Enterprise với tất cả các tính năng cao cấp.")
                            .price(2999000.0)
                            .duration(30) // 30 ngày
                            .maxPost(200) // Tối đa 100 bài viết
                            .postExpiryDays(90) // Bài viết hết hạn sau 90 ngày
                            .priority(1) // Ưu tiên cao nhất
                            .build()
            );

        }
    }
}
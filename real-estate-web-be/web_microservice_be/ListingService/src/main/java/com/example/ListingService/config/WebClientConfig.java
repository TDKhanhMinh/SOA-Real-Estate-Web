package com.example.ListingService.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${subscription.service.url}")
    private String subscriptionServiceUrl;

    @Bean
    public WebClient transactionWebClient() {
        return WebClient.builder()
                .baseUrl(subscriptionServiceUrl)
                .build();
    }
}

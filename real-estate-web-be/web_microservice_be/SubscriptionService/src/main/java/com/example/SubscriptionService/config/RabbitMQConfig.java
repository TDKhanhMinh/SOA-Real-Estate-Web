package com.example.SubscriptionService.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.queue.user}")
    private String userQueueName;

    @Value("${rabbitmq.routing-key.user-created}")
    private String userRoutingKey;

    @Bean
    public TopicExchange subscriptionExchange(){
        return new TopicExchange(exchangeName);
    }

    @Bean
    public Queue userQueue() {
        return new Queue(userQueueName);
    }

    @Bean
    public Binding userBinding(Queue userQueue, TopicExchange subscriptionExchange) {
        return BindingBuilder
                .bind(userQueue)
                .to(subscriptionExchange)
                .with(userRoutingKey);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}

package com.example.EmailService.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.core.BindingBuilder;

@Configuration
public class RabbitMQConfig {
    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.queue.user}")
    private String userQueueName;

    @Value("${rabbitmq.queue.transaction}")
    private String transactionQueueName;

    @Value("${rabbitmq.queue.property}")
    private String propertyQueueName;

    @Value("${rabbitmq.routing-key.user}")
    private String userRoutingKey;

    @Value("${rabbitmq.routing-key.transaction}")
    private String transactionRoutingKey;

    @Value("${rabbitmq.routing-key.property}")
    private String propertyRoutingKey;

    @Bean
    public TopicExchange emailExchange(){
        return new TopicExchange(exchangeName);
    }

    @Bean
    public Queue userQueue() {
        return new Queue(userQueueName);
    }

    @Bean
    public Queue transactionQueue() {
        return new Queue(transactionQueueName);
    }

    @Bean
    public Queue propertyQueue() {
        return new Queue(propertyQueueName);
    }

    @Bean
    public Binding userBinding(Queue userQueue, TopicExchange emailExchange) {
        return BindingBuilder
                .bind(userQueue)
                .to(emailExchange)
                .with(userRoutingKey);
    }

    @Bean
    public Binding transactionBinding(Queue transactionQueue, TopicExchange emailExchange) {
        return BindingBuilder
                .bind(transactionQueue)
                .to(emailExchange)
                .with(transactionRoutingKey);
    }

    @Bean
    public Binding propertyBinding(Queue propertyQueue, TopicExchange emailExchange) {
        return BindingBuilder
                .bind(propertyQueue)
                .to(emailExchange)
                .with(propertyRoutingKey);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}

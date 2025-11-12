package com.example.API_GateWay.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    @Autowired
    private JwtUtil jwtUtil;

    public JwtAuthenticationFilter() {
        super(Config.class);
    }

    public static final List<String> PUBLIC_PATHS = List.of(
            "/user/register",
            "/user/login"
    );

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            // Kiểm tra nếu đường dẫn là public thì không cần xác thực
            String path = exchange.getRequest().getURI().getPath();
            boolean isPublic = PUBLIC_PATHS.stream()
                    .anyMatch(path::startsWith);

            if (isPublic) {
                return chain.filter(exchange); // Nếu public, cho đi tiếp, không check token
            }


            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return this.onError(exchange, "Missing or invalid Authorization header", HttpStatus.UNAUTHORIZED);
            }

            String token = authHeader.substring(7);

            if (!jwtUtil.validateToken(token)) {
                return this.onError(exchange, "Invalid JWT token", HttpStatus.UNAUTHORIZED);
            }

            String userId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);

            System.out.println("Authenticated User ID: " + userId + ", Role: " + role);

            exchange = exchange.mutate().request(
                    exchange.getRequest().mutate()
                            .header("X-User-Id", userId)
                            .header("X-Role", role)
                            .build()
            ).build();

            return chain.filter(exchange);
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        exchange.getResponse().setStatusCode(httpStatus);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String responseBody = "{\"status\": " + httpStatus.value() + ", \"error\": \"" + err + "\"}";

        byte[] bytes = responseBody.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);
        
        return exchange.getResponse().writeWith(Mono.just(buffer));
    }

    public static class Config {}
}
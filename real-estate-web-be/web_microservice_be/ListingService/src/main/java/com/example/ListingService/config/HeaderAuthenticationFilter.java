package com.example.ListingService.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class HeaderAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 1. Đọc các header từ request
        String userId = request.getHeader("X-User-Id");
        String rolesHeader = request.getHeader("X-Role");

        System.out.println("Authenticated User ID from Header: " + userId + ", Roles: " + rolesHeader);


        // 2. Nếu không có header (request nội bộ hoặc không hợp lệ), bỏ qua
        if (userId == null || rolesHeader == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Chuyển đổi chuỗi roles thành List<GrantedAuthority>
        List<SimpleGrantedAuthority> authorities = Arrays.stream(rolesHeader.split(","))
                .map(role -> "ROLE_" + role) // QUAN TRỌNG: Spring Security thường yêu cầu tiền tố ROLE_
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        // 4. Tạo đối tượng Authentication
        //    Principal: là userId
        //    Credentials: null (vì đã xác thực ở Gateway)
        //    Authorities: danh sách quyền
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userId, // Đây là "principal"
                null,
                authorities
        );


        // 5. ĐẶT đối tượng Authentication vào SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 6. Cho phép request đi tiếp
        filterChain.doFilter(request, response);
    }
}
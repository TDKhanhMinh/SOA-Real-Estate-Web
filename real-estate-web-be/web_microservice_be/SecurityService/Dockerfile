# Base image: JDK để chạy ứng dụng Spring Boot
FROM eclipse-temurin:17-jdk

# Ghi thông tin tác giả
LABEL authors="WIN 11"

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file JAR đã build sẵn (từ Maven/Gradle)
COPY target/*.jar app.jar

# Lệnh mặc định khi container khởi động
ENTRYPOINT ["java", "-jar", "app.jar"]

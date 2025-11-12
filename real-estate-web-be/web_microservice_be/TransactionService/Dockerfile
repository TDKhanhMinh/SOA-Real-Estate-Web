#FROM eclipse-temurin:17-jdk
#WORKDIR /app
#COPY target/*.jar app.jar
#ENTRYPOINT ["java", "-jar", "app.jar"]

# Stage 1: Build
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]


# First stage: Build the JAR
FROM openjdk:17-jdk-slim AS builder

WORKDIR /app

# Copy Gradle wrapper and project files
COPY gradlew build.gradle settings.gradle ./
COPY gradle gradle
COPY src src

# Grant execution permissions to Gradle wrapper
RUN chmod +x gradlew

# Build the application
# RUN ./gradlew build -x test --no-daemon
RUN ./gradlew build -x test --info --no-daemon --build-cache

# Second stage: Run the JAR
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy only the built JAR from the first stage
# COPY --from=builder /app/build/libs/cart-api-*.jar /app/cart-api.jar'

COPY --from=builder /app/build/libs/*.jar /app/cart-api.jar
# COPY --from=builder /app/build/libs/*.jar /app/

# Expose the application port
EXPOSE 8081

# Run the application
CMD ["java", "-jar", "cart-api.jar"]

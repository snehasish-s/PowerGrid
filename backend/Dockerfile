# ============================================================
# PowerPulse AI Backend — Multi-stage Docker Build
# ============================================================

# ---- Stage 1: Build with Maven ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---- Stage 2: Run with lightweight JRE ----
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Add non-root user for security
RUN addgroup -S powerpulse && adduser -S powerpulse -G powerpulse
USER powerpulse

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

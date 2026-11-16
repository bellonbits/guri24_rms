# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cap JVM heap to prevent OOM kill on memory-constrained hosts
ENV MAVEN_OPTS="-Xms128m -Xmx512m -XX:+UseSerialGC -Djava.awt.headless=true"

COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -B --no-transfer-progress -Dmaven.wagon.http.retryHandler.count=5

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --from=build /app/target/financial-service-1.0.0.jar app.jar
EXPOSE 8086
ENV TZ=Africa/Nairobi
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]

# Dockerfile (Build + Run stages)
FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app
COPY backend /app
RUN mvn -B -DskipTests clean package

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/fast-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]

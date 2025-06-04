# Etapa 1: Construcción con Maven + JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app
COPY backend/. /app
RUN mvn -B -DskipTests clean package

# Etapa 2: Imagen final con JDK 21
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]

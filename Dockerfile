# Etapa 1: Construcción del proyecto con Maven
FROM maven:3.9.2-eclipse-temurin-21 AS build

WORKDIR /app
COPY backend /app
RUN mvn -B -DskipTests clean package

# Etapa 2: Imagen final más liviana
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]

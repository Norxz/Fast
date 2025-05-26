# Dockerfile
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copiamos solo el .jar que ya fue generado
COPY backend/target/fast-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]

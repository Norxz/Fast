FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app/backend
COPY backend /app/backend/
RUN chmod +x /app/backend/mvnw && /app/backend/mvnw -B -DskipTests clean package

EXPOSE 8080
CMD ["java", "-jar", "target/*.jar"]


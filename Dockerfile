FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app
COPY backend /app/
RUN chmod +x mvnw && ./mvnw -B -DskipTests clean package

EXPOSE 8080
CMD ["java", "-jar", "target/*.jar"]


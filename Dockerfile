FROM maven:3.9.5-eclipse-temurin-17

WORKDIR /app
COPY backend /app

RUN mvn -B -DskipTests clean package

EXPOSE 8080
CMD ["java", "-jar", "target/fast-0.0.1-SNAPSHOT.jar"]

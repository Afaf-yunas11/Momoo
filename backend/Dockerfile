FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy only pom first
COPY pom.xml .

# Download dependencies and cache them
RUN mvn dependency:go-offline -B

# Now copy source
COPY src ./src

# Build app
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
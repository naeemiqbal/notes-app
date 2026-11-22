# ─────────────────────────────────────────────
# Stage 1: Build the React frontend
# ─────────────────────────────────────────────
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Install dependencies first (layer-cached unless package.json changes)
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy source and build into src/main/resources/static
COPY frontend/ ./
RUN npm run build


# ─────────────────────────────────────────────
# Stage 2: Build the Spring Boot JAR
# ─────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS backend-build

WORKDIR /app

# Cache Maven dependencies before copying full source
COPY pom.xml ./
RUN mvn dependency:go-offline -q

# Copy backend source
COPY src/ ./src/

# Copy the React build output (vite outDir resolves to /app/src/main/resources/static)
COPY --from=frontend-build /app/src/main/resources/static ./src/main/resources/static

RUN mvn package -q -DskipTests


# ─────────────────────────────────────────────
# Stage 3: Lean runtime image
# ─────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=backend-build /app/target/notes-app-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

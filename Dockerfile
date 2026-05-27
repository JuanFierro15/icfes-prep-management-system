# ── Etapa 1: compilar ────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -q

COPY src ./src
RUN mvn clean package -DskipTests -q

# ── Etapa 2: imagen final ─────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

RUN apk add --no-cache musl-locales musl-locales-lang && \
    echo "es_ES.UTF-8 UTF-8" >> /etc/locale.gen

ENV LANG=es_ES.UTF-8
ENV LC_ALL=es_ES.UTF-8
ENV JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF-8 -Dstdout.encoding=UTF-8"

WORKDIR /app

COPY --from=builder /app/target/GestionIcfes-1.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

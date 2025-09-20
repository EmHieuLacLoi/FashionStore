# Build
FROM maven:3.9.9-eclipse-temurin-21 AS builder

# Folder
WORKDIR /app

# Copy
COPY pom.xml .
COPY .mvn .mvn
RUN mvn dependency:go-offline

# Cpoy source
COPY src ./src
RUN mvn clean install -DskipTests

# Run
FROM eclipse-temurin:21-jre AS runner

#Config language, timezone, JVM
ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en'
ENV TZ=Asia/Ho_Chi_Minh
ENV JAVA_OPTIONS="-Xms512M -Xmx512M -XX:+UseZGC -XX:+ZGenerational"

# Run install config
RUN set -eux && \
    ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone && \
        apt-get update && \
        apt-get install -y --no-install-recommends ca-certificates fontconfig tzdata && \
        rm -rf /var/lib/apt/lists/* && \
        mkdir /deployments && \
        chown 1001 /deployments && \
        chmod "g+rwX" /deployments && \
        chown 1001:root /deployments

# Run app
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Run with user 1001
USER 1001

# Expose port
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]





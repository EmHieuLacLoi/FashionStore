# Build
FROM oracle/graalvm-ce:21-lts-ol9 AS builder

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
FROM oracle/graalvm-ce:21-lts-ol9 AS runner

#Config language, timezone, JVM
ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en'
ENV TZ=Asia/Ho_Chi_Minh
ENV JAVA_OPTIONS="-Xms512M -Xmx512M -XX:+UseZGC -XX:+ZGenerational"

# Run install config
RUN set -eux && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo "$TZ" > /etc/timezone && \
    microdnf update && \
    microdnf install -y telnet ca-certificates freetype fontconfig && \
    microdnf clean all && \
    mkdir /deployments && \
    chown 1001 /deployments && \
    chmod "g+rwX" /deployments && \
    chown 1001:root /deployments && \
    echo "securerandom.source=file:/dev/urandom" >> /usr/lib64/graalvm/graalvm-community-java21/lib/security/java.security

# Run app
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Run with user 1001
USER 1001

# Expose port
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]





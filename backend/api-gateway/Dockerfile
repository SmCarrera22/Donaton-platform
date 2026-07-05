# Usamos la imagen oficial de Java 25 para ejecutar la app
FROM eclipse-temurin:25-jre

WORKDIR /app

# Copiamos el archivo JAR que compilaremos en tu Mac
# (Buscamos el jar ejecutable dentro de build/libs/)
COPY build/libs/*-SNAPSHOT.jar app.jar

# Exponemos el puerto de tu app
EXPOSE 8090

# Comando para iniciar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
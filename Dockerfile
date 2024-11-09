# Usamos una imagen base de Node.js
FROM node:18

# Instalar net-tools
RUN apt-get update && apt-get install -y net-tools

# Crear y definir el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de tu proyecto al contenedor
COPY . .

# Instalar las dependencias del proyecto
RUN npm install

# Exponer el puerto 3333 (puerto por defecto de AdonisJS)
EXPOSE 3333

# Ejecutar el servidor cuando el contenedor se inicie
CMD ["node", "ace", "serve", "--watch"]

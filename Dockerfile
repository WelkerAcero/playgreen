FROM node:18.20.2-alpine

# Instalación de dependencias globales
RUN npm install -g ts-node
# Instalar PostgreSQL client
RUN apk --no-cache add mysql-client

WORKDIR /app

COPY package*.json ./
COPY . .

# Instalación de dependencias del proyecto
RUN npm install
RUN npm run ts-config
RUN npm run dbgenerate

# Construye la aplicación TypeScript
RUN npm run build

COPY init_db.sh /app/init_db.sh
RUN chmod +x /app/init_db.sh

CMD ["sh", "/app/init_db.sh"]
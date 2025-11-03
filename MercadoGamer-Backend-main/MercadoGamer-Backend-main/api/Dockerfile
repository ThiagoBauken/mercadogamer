# Backend Dockerfile - MercadoGamer API
FROM node:18-alpine

# Instalar dependências do sistema para sharp e outras libs
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    vips-dev \
    fftw-dev \
    build-base

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Copiar código fonte
COPY . .

# Criar diretórios para uploads
RUN mkdir -p /app/files /app/uploads && \
    chmod -R 777 /app/files /app/uploads

# Expor portas
EXPOSE 3000 10111

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando padrão
CMD ["npm", "run", "local"]

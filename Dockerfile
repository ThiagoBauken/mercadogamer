# Backend API Dockerfile - MercadoGamer
# Este é o Dockerfile padrão para o Backend API
# Para frontends, use: Dockerfile.web ou Dockerfile.admin

FROM node:18-alpine

# Instalar dependências do sistema necessárias para sharp, bcrypt, etc
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    vips-dev \
    fftw-dev \
    build-base \
    libc6-compat

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json do backend
COPY MercadoGamer-Backend-main/MercadoGamer-Backend-main/api/package*.json ./

# Instalar dependências (otimizado para baixo uso de memória)
# NODE_OPTIONS: limita memória do Node.js durante npm install
# --no-audit: pula auditoria (mais rápido)
# --no-optional: pula dependências opcionais (economiza tempo/memória)
RUN NODE_OPTIONS="--max-old-space-size=512" npm install --no-audit --no-optional

# Copiar código do backend
COPY MercadoGamer-Backend-main/MercadoGamer-Backend-main/api/ ./

# Criar diretórios necessários
RUN mkdir -p /app/files /app/uploads && \
    chmod -R 777 /app/files /app/uploads

# Expor porta (HTTP + Socket.IO na mesma porta)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando de inicialização
CMD ["npm", "run", "local"]

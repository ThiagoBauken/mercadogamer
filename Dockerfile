# ========================================
# DOCKERFILE UNIFICADO - MercadoGamer
# Backend + Frontend Web + Frontend Admin
# ========================================

# ========================================
# STAGE 1: Build Frontend Web (Marketplace)
# ========================================
FROM node:14-alpine AS build-web

WORKDIR /app/web

# Copiar package.json do frontend web
COPY MercadoGamer-Backend-main/MercadoGamer-Backend-main/web/package*.json ./

# Instalar dependências
RUN npm ci --legacy-peer-deps

# Copiar código fonte do frontend web
COPY MercadoGamer-Backend-main/MercadoGamer-Backend-main/web/ ./

# Build de produção
RUN npm run build -- --configuration production

# ========================================
# STAGE 2: Build Frontend Admin
# ========================================
FROM node:14-alpine AS build-admin

WORKDIR /app/admin

# Copiar package.json do frontend admin
COPY MercadoGamer-Backend-main/MercadoGamer-Backend-main/adm/package*.json ./

# Instalar dependências
RUN npm ci --legacy-peer-deps

# Copiar código fonte do frontend admin
COPY MercadoGamer-Backend-main/MercadoGamer-Backend-main/adm/ ./

# Build de produção
RUN npm run build -- --configuration production

# ========================================
# STAGE 3: Backend + Servir Frontends
# ========================================
FROM node:18-alpine

# Instalar dependências do sistema para backend
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    vips-dev \
    fftw-dev \
    build-base \
    libc6-compat

WORKDIR /app

# Copiar package.json do backend
COPY MercadoGamer-Backend-main/MercadoGamer-Backend-main/api/package*.json ./

# Instalar dependências do backend
RUN npm ci && npm cache clean --force

# Copiar código do backend
COPY MercadoGamer-Backend-main/MercadoGamer-Backend-main/api/ ./

# Copiar builds dos frontends
COPY --from=build-web /app/web/dist/adm /app/public/web
COPY --from=build-admin /app/admin/dist/adm /app/public/admin

# Criar diretórios necessários
RUN mkdir -p /app/files /app/uploads /app/public && \
    chmod -R 777 /app/files /app/uploads /app/public

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicialização
CMD ["npm", "run", "start"]

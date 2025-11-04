FROM node:14-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o resto dos arquivos
COPY . .

# Expor a porta
EXPOSE 5001

# Comando padrão
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "5001", "--disable-host-check"]

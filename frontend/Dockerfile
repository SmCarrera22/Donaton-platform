# === Etapa 1: Construcción ===
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar pnpm globalmente en el contenedor
RUN npm install -g pnpm

# Copiar archivos de dependencias primero
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copiar el resto del código del frontend
COPY . .

# Construir la aplicación para producción
RUN pnpm build

# === Etapa 2: Servidor de Producción Ligero ===
FROM node:20-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar únicamente lo necesario para que Next.js funcione en producción
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Exponer el puerto por defecto de Next.js
EXPOSE 3000

# Comando para encender tu frontend clonado dentro de Docker
CMD ["pnpm", "start"]

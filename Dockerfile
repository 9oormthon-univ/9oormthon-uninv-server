# Stage 1: Build the NestJS application
FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Setup the production environment
FROM node:18-alpine AS runner
WORKDIR /app

# ✅ builder 스테이지의 node_modules 그대로 복사
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env ./

EXPOSE 3000
CMD ["node", "dist/main"]

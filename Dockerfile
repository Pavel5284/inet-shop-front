# syntax=docker/dockerfile:1

# Версию Node можно сменить при сборке: docker build --build-arg NODE_VERSION=24 .
ARG NODE_VERSION=26

# ---------- 1. Зависимости ----------
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- 2. Сборка статики ----------
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Переменные VITE_* «запекаются» в код при сборке — менять их можно только пересборкой образа.
ARG VITE_GRAPHQL_URL=/graphql
ARG VITE_CURRENCY=RUB
ARG VITE_SHOW_DEMO_LOGIN=true
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL \
    VITE_CURRENCY=$VITE_CURRENCY \
    VITE_SHOW_DEMO_LOGIN=$VITE_SHOW_DEMO_LOGIN
RUN npm run build

# ---------- 3. nginx (без root-прав, порт 8080) ----------
FROM nginxinc/nginx-unprivileged:stable-alpine AS runtime
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/security-headers.conf /etc/nginx/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=5 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

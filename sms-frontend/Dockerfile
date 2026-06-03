# ---- Build stage: produce static dist ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Vite inlines env at build time. Pass the prod API URL as a build arg:
#   docker build --build-arg VITE_API_BASE_URL=https://api.example.com ...
# Written into .env.production so the value is picked up regardless of how Vite
# resolves env (file vs process env). Other VITE_SUPPORT_* keys stay from the
# committed .env.production.
ARG VITE_API_BASE_URL
RUN if [ -n "$VITE_API_BASE_URL" ]; then \
      sed -i "/^VITE_API_BASE_URL=/d" .env.production 2>/dev/null || true; \
      echo "VITE_API_BASE_URL=$VITE_API_BASE_URL" >> .env.production; \
    fi
RUN npm run build

# ---- Runtime stage: nginx serves the SPA ----
FROM nginx:alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

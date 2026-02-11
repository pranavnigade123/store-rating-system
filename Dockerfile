# Multi-stage build for frontend + backend
FROM node:20-alpine AS frontend-build

WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# Remove .env file to use default relative path
RUN rm -f .env
RUN npm run build

# Backend stage
FROM node:20-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source
COPY backend/ ./

# Copy built frontend from previous stage
COPY --from=frontend-build /frontend/dist ./frontend/dist

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "src/server.js"]

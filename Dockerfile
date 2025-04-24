# Build Go binary
FROM golang:1.24.1-alpine AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o goetl ./cmd/main.go

# Build React UI
FROM node:20-alpine AS ui-builder
WORKDIR /ui
# Set Node options to handle OpenSSL issues with newer Node versions
ENV NODE_OPTIONS=--openssl-legacy-provider
COPY webui/webui/package*.json ./webui/
RUN cd webui && npm install
COPY webui/webui ./webui

RUN cd webui && npm run build

# Final minimal image
FROM alpine:latest
WORKDIR /app

# Install Caddy
RUN apk add --no-cache caddy

COPY --from=builder /app/goetl .
COPY --from=ui-builder /ui/webui/build ./webui/build

# Caddyfile for static + API reverse proxy
COPY Caddyfile /etc/caddy/Caddyfile

ENV UI_STATIC_DIR=/app/webui/build
EXPOSE 8080

# NOTE: Make sure your Go backend listens on port 8081, not 8080!
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget --spider -q http://localhost:8080/api/ping || exit 1

# Run both Go backend and Caddy
CMD ["sh", "-c", "./goetl & caddy run --config /etc/caddy/Caddyfile --adapter caddyfile"]

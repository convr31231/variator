# Node 22+ required for built-in node:sqlite and sharp
FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install backend dependencies first (better layer cache)
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev

# Site static files + server source
COPY . .

# Runtime data lives on a mounted volume (see compose.yaml)
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=8780 \
    DATA_DIR=/data

RUN mkdir -p /data/uploads/thumbs /data/backups \
  && chown -R node:node /data /app

USER node
WORKDIR /app/server
EXPOSE 8780

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8780)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/index.js"]

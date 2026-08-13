FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# Outils de compilation pour les modules natifs (argon2)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci

RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src

EXPOSE 3000
# migrate deploy avant de demarrer : idempotent (no-op si rien en attente), garantit que le schema
# de la base est toujours aligne avec le code deploye, jamais oublie comme le 13/08 (v1.6.0).
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/server.ts"]

FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile --prod

COPY src/ ./src/

ENV UPTRACK_API_KEY=set-at-runtime

ENTRYPOINT ["node", "src/index.js"]

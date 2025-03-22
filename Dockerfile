FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY package.json .

RUN npm install && npm cache clean --force

COPY . .

RUN npm run db:generate && npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]

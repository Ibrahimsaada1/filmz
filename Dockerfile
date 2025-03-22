FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run db:generate && npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]

FROM node:20
RUN apt-get update && apt-get install -y libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 80
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/index.js"]
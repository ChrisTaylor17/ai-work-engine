FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache python3 make g++ linux-headers libudev-zero-dev && npm install --omit=dev

COPY . .
RUN npm install && npm run build

EXPOSE 3001

CMD ["npm", "start"]
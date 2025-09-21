FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache python3 make g++ && npm install --omit=dev

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
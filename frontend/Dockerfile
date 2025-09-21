FROM node:20-alpine

WORKDIR /app

# Install Python and build tools for native dependencies
RUN apk add --no-cache python3 make g++ libudev-dev libusb-dev

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
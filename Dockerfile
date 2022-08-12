# development docker container
FROM node:16.14-alpine

RUN npm install -g pnpm

# Create app directory
WORKDIR /app

COPY . .

EXPOSE 5000
CMD ["pnpm", "dev:docker"]


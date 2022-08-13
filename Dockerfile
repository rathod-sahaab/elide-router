# development docker container
FROM node:16.14-alpine

# Create app directory
WORKDIR /app

COPY . .

CMD ["pnpm", "dev:docker"]

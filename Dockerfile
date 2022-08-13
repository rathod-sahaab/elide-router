# development docker container
FROM node:16.14-alpine

RUN npm install -g pnpm

# Create app directory
WORKDIR /app

COPY . .

# API server
EXPOSE 5000

# Prisma studio
EXPOSE 5555

CMD ["pnpm", "dev:docker"]


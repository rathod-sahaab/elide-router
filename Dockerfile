# development docker container
FROM node:16.14-alpine

# containerized development helper packages
RUN apk update
RUN apk add git fish starship

RUN npm install -g pnpm

USER node
SHELL ["fish"]

COPY ./development/configs/* ~/.config/

# Create app directory
WORKDIR /app

COPY . .

# API server
EXPOSE 5000

# Prisma studio
EXPOSE 5555

CMD ["pnpm", "dev:docker"]

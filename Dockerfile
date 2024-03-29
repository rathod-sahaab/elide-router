# development docker container
FROM node:16.14-alpine

RUN npm install -g pnpm

USER node
# Create app directory
WORKDIR /elide-backend

COPY --chown=node:node . .

CMD ["pnpm", "dev:docker"]

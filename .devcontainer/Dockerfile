# development docker container
FROM node:16.14-alpine

# containerized development helper packages
RUN apk update
RUN apk add git fish starship openssh

RUN npm install -g pnpm

USER node
ENV SHELL /usr/bin/fish

RUN mkdir -p /home/node/.config/fish/

# Create app directory
WORKDIR /elide-backend

COPY --chown=node:node . .

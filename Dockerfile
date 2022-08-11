FROM node:16.14-alpine

RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json .
COPY pnpm-lock.yaml .

# Install app dependencies
RUN pnpm i

COPY prisma ./prisma/

# Generate prisma client, leave out if generating in `postinstall` script
RUN pnpm prisma generate

COPY . .

EXPOSE 5000
CMD ["pnpm", "dev"]


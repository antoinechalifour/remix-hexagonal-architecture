FROM node:18-slim as builder

# OpenSSL is required to build prisma on M1 Mac
# (See https://github.com/prisma/prisma/issues/861#issuecomment-881992292)
RUN apt-get update
RUN apt-get install -y openssl
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn prisma:setup
RUN yarn build

FROM node:18-slim as runner
RUN apt-get update
RUN apt-get install -y openssl
WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package.json yarn.lock ./

 # --ignore-script options to prevent Remix from launching its setup script
 # which requires @remix-run/dev which is a dev dependency...
RUN yarn install --production --ignore-scripts
# ... so we manually copy the one generated from the building container
COPY --from=builder /usr/src/app/node_modules/@remix-run ./node_modules/@remix-run
COPY --from=builder /usr/src/app/node_modules/remix ./node_modules/remix

# dev dependnecies are required for generating the prisma client,
# so we copy the one generated in the builder container
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma/client ./node_modules/@prisma/client

# Nest.js build output
COPY --from=builder /usr/src/app/dist ./dist
# Remix build output (client)
COPY --from=builder /usr/src/app/public ./public
# Remix build output (server)
COPY --from=builder /usr/src/app/build ./build

CMD ["node", "dist/main"]
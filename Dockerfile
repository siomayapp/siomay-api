FROM node:16-alpine AS builder
ENV NODE_ENV build
USER node
WORKDIR /usr/src/app
COPY package.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production

FROM node:16-alpine
ENV NODE_ENV production
USER node
WORKDIR /usr/src/app
COPY --from=builder --chown=node:node /usr/src/app/package*.json ./
COPY --from=builder --chown=node:node /usr/src/app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /usr/src/app/dist/ ./dist
RUN chown node:node -R /usr/src/app/dist
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]
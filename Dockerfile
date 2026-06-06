FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY api ./api
COPY Document ./Document
COPY server.mjs ./server.mjs
RUN mkdir -p ./user-documents/questions

EXPOSE 3000
CMD ["node", "server.mjs"]

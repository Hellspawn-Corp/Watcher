# Stage 1: Build
FROM node:alpine AS build
WORKDIR /app
COPY . .
RUN yes | npm install -g pnpm && \
    yes | pnpm install && \
    yes | pnpm run build

# Stage 2: Production dependencies
FROM node:alpine AS prod-deps
WORKDIR /app
COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
RUN yes | npm install -g pnpm && \
    yes | pnpm install --prod

# Stage 3: Final deploy
FROM node:alpine AS deploy
WORKDIR /app
COPY --from=build /app/prod ./prod
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/package.json ./
CMD ["npm", "run", "start"]

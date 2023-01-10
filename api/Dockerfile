# Stage 1: Install dependencies
FROM node:16 AS dependencies

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

# Stage 2: Build source
FROM node:16 AS build

# On Railway, to access environment variables during container build, you must declare them as arguments
# Reference: https://docs.railway.app/deploy/dockerfiles
ARG DATABASE_URL

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

RUN yarn prisma generate
RUN yarn prisma migrate deploy
RUN yarn build

# Stage 3: Run
FROM node:16 AS runner

ENV NODE_ENV production

WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD export PORT="${PORT:-3000}" \ 
    && node dist/src/main

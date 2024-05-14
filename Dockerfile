FROM node:lts as build
ARG VITE_BACKEND_URL
ARG ORIGIN

ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV ENV ORIGIN=${ORIGIN}
ENV PROTOCOL_HEADER=x-forwarded-proto
ENV HOST_HEADER=x-forwarded-host

WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

FROM node:lts as run
ARG VITE_BACKEND_URL
ARG ORIGIN

ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV ENV ORIGIN=${ORIGIN}
ENV PROTOCOL_HEADER=x-forwarded-proto
ENV HOST_HEADER=x-forwarded-host

WORKDIR /app
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000 8080
CMD ["node", "-r", "dotenv/config", "build"]
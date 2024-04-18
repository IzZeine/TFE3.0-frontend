FROM node:lts as build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

FROM node:lts as run
WORKDIR /app
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/build ./build
RUN npm install --omit=dev
EXPOSE 3000 8080
CMD ["node", "build"]
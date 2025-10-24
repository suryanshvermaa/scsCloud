FROM node:22-alpine AS builder

WORKDIR /build

COPY package*.json ./
RUN npm install
COPY src/ src/
COPY tsconfig.json tsconfig.json
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app
COPY --from=builder build/package*.json .
COPY --from=builder build/node_modules node_modules
COPY --from=builder build/dist dist/
CMD ["npm","start"]

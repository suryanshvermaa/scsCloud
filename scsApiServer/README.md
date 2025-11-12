# SCS API Server ☁️

TypeScript/Express API for SCS Cloud: authentication, payments, S3-compatible Object Storage, HLS transcoding orchestration, static site hosting, and gRPC-driven container deployments.

## Overview ✨
- 🧩 Express API with MongoDB models for users, payments, hosting, and object storage
- 🗂️ S3-compatible operations (MinIO/AWS S3) via signed URLs
- 🎬 HLS transcoding queued as Kubernetes Jobs
- 🌐 Static hosting via subdomain routing and Kubernetes Ingress
- 🚀 Deployment management via gRPC ContainerService
- 📦 Background processing using BullMQ (Redis)

## Architecture 🏗️
- API: Node.js + TypeScript (Express)
- Data: MongoDB (Mongoose)
- Object Storage: MinIO (Kubernetes) or local MinIO via Docker
- Jobs/Infra: Kubernetes Jobs and Ingress (client-node)
- Payments: Cashfree PG (sandbox by default)
- Queues: BullMQ (Redis)
- Deployments: gRPC client to external ContainerService

## Folder structure 📁
- `src/index.ts` — app bootstrap, health check, subdomain proxy, routers, error middleware
- `src/routes/*` — route mounts per domain (user, payment, transcoding, hosting, object-storage, cost, deployment, bot)
- `src/controllers/*` — endpoint handlers
- `src/models/*` — Mongoose schemas (User, Payment, Website, ObjectStorage)
- `src/services/*` — integrations: gRPC client, object storage, Kubernetes jobs, queues, payments
- `src/bot/*` — lightweight docs assistant using Groq
- `pb/*` — generated protobuf types (run generator below)
- `docs/*` — API docs for subdomains (Cost, ObjectStorage, Transcoding, Deployment)

## Prerequisites 🧰
- Node.js 18+ (Dockerfile uses node:22-alpine)
- MongoDB URI
- Redis-compatible server for BullMQ
- Kubernetes cluster/context configured in your environment (kubeconfig; namespaces: `scs-cloud`, `minio`)
- A DNS or local hosts mapping for `${HOSTING_DOMAIN}` if testing subdomains/Ingress

## Environment variables 🔧
Required/used across the codebase:

- Core
	- `PORT` — HTTP port (default 8080)
	- `MONGO_URI` — MongoDB connection string

- Auth and tokens
	- `ACCESS_TOKEN_SECRET` — JWT for access tokens
	- `REFRESH_TOKEN_SECRET` — JWT for refresh tokens
	- `OTP_SECRET` — JWT for email verification payload
	- `ACCESS_KEY_CREDENTIALS_SECRET` — signs programmatic accessKey
	- `SECRET_ACCESS_KEY_CREDENTIALS_SECRET` — signs programmatic secretAccessKey

- Pricing
	- `TRANSCODER_SERVICE_CHARGE` — rupees per MB
	- `HOSTING_SERVICE_CHARGE_PER_30_DAYS` — rupees per 30 days
	- `STORAGE_PRICE_PER_GB_PER_MONTH_IN_RUPEES` — rupees per GB per month

- Hosting and routing
	- `HOSTING_DOMAIN` — base domain used to build URLs and Ingress hosts (e.g. example.com)
	- `BUCKET_HOST_FOR_HOSTING` — base URL for static hosting origin the proxy targets
	- `IS_UNDER_KUBERNETES` — set to "true" when running in k8s to prefer cluster service endpoints

- Object storage (static hosting job envs)
	- `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY` — credentials used by hosting job to push site artifacts
	- `MY_BUCKET_NAME` — target bucket for hosting job artifacts

- Queues (BullMQ / Redis)
	- `QUEUE_HOST`, `QUEUE_PORT`, `QUEUE_USER`, `QUEUE_PASSWORD`

- Payments (Cashfree)
	- `CASHFREE_APP_KEY`, `CASHFREE_APP_SECRET_KEY`

- gRPC ContainerService
	- `CONTAINER_SERVICE_HOST` — hostname of ContainerService
	- `CONTAINER_SERVICE_PORT` — port (default 8000)

- Bot (Groq)
	- `GROQ_API_KEY`

## Install and run 🚀
1) Install dependencies

```bash
npm install
```

2) Development

```bash
npm run dev
```

3) Production build and run

```bash
npm run build
npm start
```

4) Generate protobuf TS types (after editing `.proto` files)

```bash
# uses @grpc/proto-loader CLI; outputs to ./pb
npm run proto:gen
# or
./buildgRPC.sh
```

## Docker 🐳
Build and run the API server in Docker:

```bash
# build
docker build -t scs-api:latest .

# run (example; pass your envs)
docker run --rm -p 8080:8080 \
	-e MONGO_URI=mongodb://host.docker.internal:27017/scs \
	-e ACCESS_TOKEN_SECRET=... -e REFRESH_TOKEN_SECRET=... -e OTP_SECRET=... \
	-e HOSTING_DOMAIN=example.com \
	-e QUEUE_HOST=... -e QUEUE_PORT=... -e QUEUE_USER=... -e QUEUE_PASSWORD=... \
	-e CASHFREE_APP_KEY=... -e CASHFREE_APP_SECRET_KEY=... \
	-e CONTAINER_SERVICE_HOST=host.docker.internal -e CONTAINER_SERVICE_PORT=8000 \
	scs-api:latest
```

## Local MinIO (optional) 💾
Run a local S3-compatible server for development:

```bash
docker compose -f s3.docker-compose.yml up -d
```

Then set endpoints accordingly (controllers default to `http://localhost:9000` when `IS_UNDER_KUBERNETES!="true"`).

## Kubernetes integration ☸️
- Kube config is loaded from the default context (`@kubernetes/client-node`)
- Transcoding jobs: `src/services/k8s/transcodingJob.ts` (runs `suryanshvermaaa/transcoding-container`)
- Hosting jobs: `src/services/k8s/hostingJob.ts` (runs `suryanshvermaaa/hosting-container`) and creates an Ingress via `websiteIngress.ts`
- Per-user MinIO: `src/services/objectStorage/methods.ts` + `getMinioManifests.ts` deploy a MinIO instance and Ingress in namespace `minio`
- Ensure DNS or local hosts resolve `minio-{userIdSanitized}.${HOSTING_DOMAIN}` and service subdomains for deployments

## gRPC ContainerService 🔌
- Proto: `containerService.proto`
- Generated types: `pb/containerService/*`
- Client: `src/services/gRPC/gRPC.service.ts`
- Configure `CONTAINER_SERVICE_HOST`/`CONTAINER_SERVICE_PORT` to point to the running gRPC backend

## Queues 📬
BullMQ queues (Redis): Email, APIKEYS, Hosting, HostingRenewal, PaymentQueue; configured in `src/services/queue.service.ts`.

## API overview 📚
Routers are mounted in `src/index.ts`:

- `/api/v1` — user, transcoding, cost, object-storage, deployment
- `/api/payment` — payments
- `/api/host` — static hosting
- `/api/v1/bot` — docs/chat assistant

Detailed docs per domain:
- Cost API — `docs/Cost-API.md`
- Object Storage API — `docs/ObjectStorage-API.md`
- Transcoding API — `docs/Transcoding-API.md`
- Deployment API — `docs/deployment-API.md`

Health check:
- `GET /api/v1/health-check` → { success, message, data.timestamp }

## Subdomain proxy for hosted sites 🌐
Requests to non-`api`/`www`/`localhost` subdomains are proxied to `${BUCKET_HOST_FOR_HOSTING}/{subdomain}` and `index.html` is served for `/`.

## Development scripts 🛠️
- `npm run dev` — ts-node via nodemon
- `npm run build` — compile TypeScript to `dist`
- `npm start` — run compiled server
- `npm run proto:gen` — generate TS types from `.proto`

## Contributing / next steps 🧭
- Standardize token handling to `Authorization: Bearer` across endpoints
- Add OpenAPI/Swagger spec with schemas and examples
- Add integration tests (mock gRPC/Redis)
- Add Helm charts or kustomize for k8s resources


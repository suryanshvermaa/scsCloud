# SCS Cloud ☁️

End-to-end cloud platform for video transcoding (HLS), static-site hosting, payments and email notifications — built as a multi-service monorepo.


## Why this repo exists ✨

SCS Cloud brings together a TypeScript/Node.js API, a React frontend, background workers, and containerized jobs that run on AWS (S3/ECS) to offer:

- 🎬 HLS video transcoding (FFmpeg-based, stored on S3)
- 🌐 Static website hosting to S3 (per-site subdomains supported via proxy)
- 💳 Payment integration (Cashfree) with SCS Coins crediting
- 📬 Email notifications using BullMQ workers (Redis)
- 🗄️ MongoDB for persistence
- 🐳 Docker Compose for local dev and ☸️ Kubernetes manifests for cluster deployment

---

## Monorepo at a glance 🗂️

- `scsApiServer/` — TypeScript Express API (auth, transcoding/hosting orchestration, payments, queues)
- `scscloud/` — React + Vite frontend (TailwindCSS)
- `emailServer/` — BullMQ workers + Nodemailer for all outbound emails
- `scs-cloud-services/`
   - `Hosting-container/` — Builds a static site and uploads to S3
   - `Transcoding-container/` — Downloads source from S3, transcodes via FFmpeg, uploads HLS outputs to user S3
- `scs-hls-client/` — Lightweight JS client helpers for upload + transcode flows
- `k8s/` — Kind/NGINX Ingress setup and per-service Kubernetes manifests (no secrets committed)
- `docker-compose.yml`, `dockercompose.dev.yaml` — Local services and dev stack
- `mongo-data/`, `redis_data/` — Local persistent volumes (git-ignored)

---

## High-level architecture 🧭

Notes:
- The API has a subdomain proxy: non-`api` subdomains are forwarded to S3 websites (see `src/index.ts`).
- Background work uses BullMQ (Redis).
- On Kubernetes, traffic flows via NGINX Ingress to `scs-cloud` (frontend) and `scs-cloud-app-service` (API).

---

## Quick start (Linux) 🚀

Pick one of the options below.

### Option A — Dev stack with Docker Compose 🐳

Prerequisites:
- Docker Engine (or Docker Desktop on Linux)
- Bash shell

1) Create a root `.env.dev` used by `dockercompose.dev.yaml` (placeholders shown):

```bash
# Database and Redis
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=<your-mongo-root-password>
REDIS_PASSWORD=<your-redis-password>

# Email worker
MY_EMAIL=<your-smtp-email>
MY_PASSWORD=<your-smtp-app-password>
QUEUE_PASSWORD=<same-as-redis-password>

# API server
ACCESS_TOKEN_SECRET=<secret>
REFRESH_TOKEN_SECRET=<secret>
OTP_SECRET=<secret>
ACCESS_KEY_CREDENTIALS_SECRET=<secret>
SECRET_ACCESS_KEY_CREDENTIALS_SECRET=<secret>
MONGO_URI=mongodb://root:${MONGO_INITDB_ROOT_PASSWORD}@mongoDb:27017/scsCloudDB

# AWS + Hosting/Transcoding config
ACCESS_KEY_ID=<aws-access-key-id>
SECRET_ACCESS_KEY=<aws-secret-access-key>
MY_BUCKET_NAME=<your-s3-bucket>
BUCKET_HOST_FOR_HOSTING=<https://s3.<region>.amazonaws.com/<bucket>>
HOSTING_DOMAIN=<your-hosting-domain-if-any>

CLUSTER_ARN=<ecs-cluster-arn>
TRANSCODER_TASK_DEFINITION_ARN=<task-def-arn>
HOSTER_TASK_DEFINITION_ARN=<task-def-arn>
TRANSCODER_TASK_NAME=<task-name>
HOSTER_TASK_NAME=<task-name>
MY_SUBNET_1=<subnet-id>
MY_SUBNET_2=<subnet-id>
MY_SUBNET_3=<subnet-id>
MY_SECURITY_GROUP=<sg-id>

# Payments
CASHFREE_APP_KEY=<cashfree-key>
CASHFREE_APP_SECRET_KEY=<cashfree-secret>

# Fees
TRANSCODER_SERVICE_CHARGE=0
HOSTING_SERVICE_CHARGE_PER_30_DAYS=0

# Frontend origin for CORS
CLIENT_ORIGIN=http://localhost:5173
```

2) Start the dev stack:

```bash
docker compose -f dockercompose.dev.yaml up -d
```

This launches MongoDB, Redis, the email worker, and the API server (port 3000). Frontend runs separately via Vite dev server.

3) Run the frontend locally:

```bash
cd scscloud && npm install && npm run dev
```

4) Stop everything:

```bash
docker compose -f dockercompose.dev.yaml down
```

Optional: Use `docker-compose.yml` for a smaller stack (MongoDB, Redis, Email worker).

### Option B — Manual local development 🛠️

In separate terminals:

```bash
# API server
cd scsApiServer && npm install && npm run dev

# Frontend
cd scscloud && npm install && npm run dev

# Email worker
cd emailServer && npm install && npm run dev
```

HLS client helpers (optional):

```bash
cd scs-hls-client && npm install && node index.js
```

---

## Kubernetes deployment ☸️

Manifests are under `k8s/`. A quick path using Kind + NGINX Ingress (see `k8s/README.md` for full details):

```bash
# Create local Kind cluster
kind create cluster --name suryansh-cluster --config ./k8s/cluster.yaml

# Install NGINX ingress controller
kubectl apply -f https://kind.sigs.k8s.io/examples/ingress/deploy-ingress-nginx.yaml

# Apply namespace, DB and Redis
kubectl apply -f ./k8s/namespace.yaml -f ./k8s/db -f ./k8s/redis-server

# Apply app services (ensure you created the required secrets beforehand)
kubectl apply -f ./k8s/email-server -f ./k8s/api-server -f ./k8s/frontend -f ./k8s/ingress.yaml

# Watch pods
kubectl get pods -n scs-cloud --watch
```

Ingress routes:
- Frontend: http://localhost/
- API: http://api.localhost/

Secrets are intentionally not included in this repository. Create them per your environment before applying deployments.

---

## Service details 🔍

- API Server (`scsApiServer/`)
   - Express + TypeScript
   - Routes: user auth, transcoding, payments, hosting
   - Integrations: MongoDB, Redis (BullMQ), AWS S3 & ECS, Cashfree
   - Special: subdomain proxy to S3 static sites
   - Local port: 3000 (via dev compose)

- Frontend (`scscloud/`)
   - React + Vite + Tailwind CSS
   - Development port: 5173
   - Production build: static assets suitable for S3/NGINX

- Email Worker (`emailServer/`)
   - BullMQ workers: OTP, transcoding finished, API keys, hosting, hosting renewal, payments
   - Uses Nodemailer (configure your SMTP credentials via env)

- Transcoding job (`scs-cloud-services/Transcoding-container/`)
   - Downloads source from S3, runs FFmpeg to 1080p/720p/480p/360p HLS, uploads to user S3
   - Notifies via BullMQ when done

- Hosting job (`scs-cloud-services/Hosting-container/`)
   - Builds the static site and uploads to `hosted-websites/<site>/...` in S3

- Client helpers (`scs-hls-client/`)
   - Simple JS wrappers around upload/transcode API flows

---

## Environment variables 🔐

This repo avoids committing secrets or values. Use the `.env.example` files where present and the lists below as a guide.

- API server (`scsApiServer/.env` sample keys)
   - PORT, MONGO_URI
   - ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, OTP_SECRET
   - ACCESS_KEY_CREDENTIALS_SECRET, SECRET_ACCESS_KEY_CREDENTIALS_SECRET
   - ACCESS_KEY_ID, SECRET_ACCESS_KEY, MY_BUCKET_NAME
   - BUCKET_HOST_FOR_HOSTING, HOSTING_DOMAIN
   - CLUSTER_ARN, TRANSCODER_TASK_DEFINITION_ARN, HOSTER_TASK_DEFINITION_ARN, TRANSCODER_TASK_NAME, HOSTER_TASK_NAME
   - MY_SUBNET_1..3, MY_SECURITY_GROUP
   - QUEUE_HOST, QUEUE_USER, QUEUE_PASSWORD, QUEUE_PORT
   - CASHFREE_APP_KEY, CASHFREE_APP_SECRET_KEY
   - TRANSCODER_SERVICE_CHARGE, HOSTING_SERVICE_CHARGE_PER_30_DAYS
   - CLIENT_ORIGIN

- Email worker (`emailServer/.env`)
   - MY_EMAIL, MY_PASSWORD
   - QUEUE_HOST, QUEUE_PORT, QUEUE_USER, QUEUE_PASSWORD

- Transcoding container (`scs-cloud-services/Transcoding-container/.env`)
   - MY_ACCESS_KEY_ID, MY_SECRET_ACCESS_KEY
   - USER_ACCESS_KEY_ID, USER_SECRET_ACCESS_KEY
   - MY_BUCKET_NAME, USER_BUCKET_NAME, VIDEO_KEY, BUCKET_PATH
   - USER_EMAIL
   - QUEUE_HOST, QUEUE_PORT, QUEUE_USER, QUEUE_PASSWORD

- Hosting container (`scs-cloud-services/Hosting-container/.env`)
   - MY_ACCESS_KEY_ID, MY_SECRET_ACCESS_KEY, MY_BUCKET_NAME
   - WEB_URL (site slug to publish)

- Frontend (`scscloud/.env` or `.env.development`)
   - VITE_API_URL (optional; for production, set your API origin)

Never commit `.env` files. Rotate credentials regularly and scope IAM minimally.

---

## Data and persistence 💾

- Docker Compose volumes:
   - `./mongo-data` → MongoDB data
   - `./redis_data` → Redis data (AOF enabled in dev compose)
- Kubernetes:
   - Mongo: `scs-cloud-pv`/`scs-cloud-pvc` (hostPath used in sample)
   - Redis: `scs-cloud-redis-pv`/`scs-cloud-redis-pvc`

Adjust storage classes/paths for your cluster. The provided manifests are examples for local Kind.

---

## Troubleshooting 🧰

- API cannot reach MongoDB or Redis
   - Check container names and network: `mongoDb` and `redis` are the service names in dev compose
   - Ensure `MONGO_URI` and `QUEUE_*` are correctly set and passwords match

- Emails not sending
   - Use an SMTP provider/app password; many providers block basic auth

- CORS/cookies issues in local dev
   - Set `CLIENT_ORIGIN=http://localhost:5173` and use `withCredentials: true` from the frontend

- Ingress not routing
   - Confirm NGINX ingress installation and that hosts `localhost` and `api.localhost` match your entries

---

## Contributing 🤝

1. Fork the repo
2. Create a feature branch
3. Commit and push
4. Open a Pull Request

---

## License 📄

Add your license information here.
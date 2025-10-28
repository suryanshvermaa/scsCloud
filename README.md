# SCS Cloud ☁️

Cloud-native platform for video transcoding (HLS), static-site hosting, object storage, payments, and email notifications — implemented as a multi-service monorepo.


## Functionalities ✨

- 🎬 HLS video transcoding via FFmpeg (outputs stored on S3-compatible storage)
- 🌐 Static website hosting to S3 with per-site subdomains (automatic proxying from API)
- 🗄️ Object Storage (MinIO in Kubernetes) with programmatic access keys and signed-URL flows
- 💳 Payments (Cashfree) with SCS Coins crediting and usage-based deductions
- 🤖 Built-in scs-bot assistant (Groq-powered) for quick guidance, snippets, and onboarding help
- 📬 Email notifications powered by BullMQ workers (Redis)
- 🗄️ MongoDB for persistence (users, payments, websites, storage metadata)
- 🐳 Docker Compose for local dev and ☸️ Kubernetes manifests for cluster deployments

---

## Repository map 🗂️

- `scsApiServer/` — TypeScript Express API (auth, transcoding/hosting orchestration, object storage, payments, queues)
   - `src/bot/` — scs-bot conversational assistant (Groq SDK with LangChain-style tool-calling), exposed at `/api/v1/bot`
- `scscloud/` — React + Vite frontend (TailwindCSS)
- `emailServer/` — BullMQ workers + Nodemailer (OTP, payment, hosting, transcoding, API keys)
- `scs-cloud-services/`
   - `Hosting-container/` — Builds static sites and uploads to S3 (`hosted-websites/<site>/...`)
   - `Transcoding-container/` — Downloads from S3, transcodes to 1080p/720p/480p/360p HLS, re-uploads
- `scs-hls-client/` — JS helpers for upload + transcode flows
- `k8s/` — Kind + NGINX Ingress setup and per-service manifests (secrets excluded by design)
- `docker-compose.yml` and `dockercompose.dev.yaml` — Local services and dev stack

---

## Architecture overview 🧭

- API provides a subdomain proxy: if the request host is not `api`, `www`, or `localhost`, it proxies to `${BUCKET_HOST_FOR_HOSTING}/{subdomain}` and resolves `/` to `index.html`.
- Background jobs (email notifications) run via BullMQ workers in `emailServer/` using Redis.
- In Kubernetes, Object Storage is implemented with on-demand MinIO per-user services. The API issues access keys, manages expiry, and exposes signed URLs. Endpoints switch between `localhost:9000` for local and `http://<service>.minio.svc.cluster.local:9000` in-cluster.
- K8s traffic is routed through NGINX Ingress to `scs-cloud` (frontend) and `scs-cloud-app-service` (API).

---

## Tech stack 🧰

- Languages & frameworks
   - Backend: Node.js, TypeScript, Express
   - Frontend: React, Vite, Tailwind CSS, Headless UI, React Router
- Data & queues
   - MongoDB (mongoose), Redis + BullMQ
- Cloud & media
   - AWS SDK (S3), FFmpeg (in transcoding container)
   - Static hosting to S3; NGINX for serving built frontend images
- AI assistant
   - scs-bot: Groq SDK with LangChain-style tool calling and function schemas (see `scsApiServer/src/bot/*`)
- Infrastructure
   - Docker & Docker Compose, Kubernetes (Kind), NGINX Ingress, MinIO (object storage in k8s)

---

<!-- Architecture diagram (Mermaid) removed per request; using image-based diagrams only. -->

## Visual architecture 📸

> High-level diagrams for quick orientation (see `readmeAssets/`).

- Kubernetes topology

![Kubernetes Architecture](./readmeAssets/k8sArchitecture.png)

- Service internals

![Transcoding Service Architecture](./readmeAssets/trascodingServiceArchitecture.png)

![Hosting Service Architecture](./readmeAssets/hostingServiceArchitecture.png)

![Object Storage Architecture](./readmeAssets/objectStorageArchitecture.png)

---

## Prerequisites 📋

- Docker Desktop (with WSL2 backend recommended on Windows)
- Node.js 18+ (to run services locally without Docker)
- kubectl, kind (for local Kubernetes), and an ingress controller if you plan to use k8s

---

## Quick start (Docker Compose) 🚀

This starts MongoDB, Redis, and the email worker. Run the API server and frontend in separate terminals.

1) Create a root `.env.dev` file (used by `dockercompose.dev.yaml`). Replace placeholders with your values:

```powershell
# Database and Redis
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=<your-mongo-root-password>
REDIS_PASSWORD=<your-redis-password>

# Email worker
MY_EMAIL=<your-smtp-email>
MY_PASSWORD=<your-smtp-app-password>
QUEUE_PASSWORD=<same-as-redis-password>
```

2) Start the dev stack:

```powershell
docker compose -f dockercompose.dev.yaml up -d
```

This launches MongoDB, Redis, and the email worker. MongoDB and Redis are internal to the Compose network.

3) Run the API server (separate terminal):

```powershell
cd scsApiServer
npm install
npm run dev
```

4) Run the frontend (separate terminal):

```powershell
cd scscloud
npm install
npm run dev
```

5) Stop everything:

```powershell
docker compose -f dockercompose.dev.yaml down
```

Tip: The root `docker-compose.yml` contains a similar minimal stack (MongoDB, Redis, Email worker).

---

## Kubernetes deployment ☸️

Manifests are under `k8s/`. Example workflow (Kind + NGINX Ingress). Adjust hosts in `k8s/ingress.yaml` to your domain or use port-forwarding.

```powershell
# Create local Kind cluster
kind create cluster --name suryansh-cluster --config .\k8s\cluster.yaml

# Install NGINX Ingress Controller
kubectl apply -f .\k8s\nginx-ingress-controller.yaml

# Namespace, DB, Redis
kubectl apply -f .\k8s\namespace.yaml -f .\k8s\db -f .\k8s\redis-server

# App services (ensure secrets exist first)
kubectl apply -f .\k8s\email-server -f .\k8s\api-server -f .\k8s\frontend -f .\k8s\ingress.yaml

# Watch status
kubectl get pods -n scs-cloud --watch

# Optional: port-forward ingress for local access
kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 3000:80
```

Ingress defaults (sample):
- Frontend: http://suryanshverma.live
- API: http://api.suryanshverma.live

For local-only testing you may change hosts to `localhost` and `api.localhost` in `k8s/ingress.yaml`.

### Using your domain pointing to 127.0.0.1 🏠

If you’ve pointed DNS A records to your machine (e.g., `suryanshverma.live -> 127.0.0.1`), here’s how to access the cluster locally:

1) Ensure both hosts resolve to localhost
    - Public DNS A records:
       - `suryanshverma.live` → `127.0.0.1`
       - `api.suryanshverma.live` → `127.0.0.1`
    - Alternatively, use Windows hosts file (requires Administrator):
       - File: `C:\Windows\System32\drivers\etc\hosts`
       - Add:
          - `127.0.0.1  suryanshverma.live`
          - `127.0.0.1  api.suryanshverma.live`

2) Port-forward the ingress controller
    - Easiest (no admin ports):
       - `kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 3000:80`
       - Browse with explicit port:
          - Frontend → `http://suryanshverma.live:3000`
          - API → `http://api.suryanshverma.live:3000`
    - Optional (admin required, may conflict with other services):
       - Forward to port 80 directly so you can omit the port in the URL:
          - `kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 80:80`
          - Then browse:
             - Frontend → `http://suryanshverma.live`
             - API → `http://api.suryanshverma.live`

3) Frontend config
    - If you build the frontend Docker image, pass `--build-arg VITE_API_URL=http://api.suryanshverma.live[:3000]` (include `:3000` if you used the first port-forward option).
    - In dev (Vite), configure the app to call `http://api.suryanshverma.live[:3000]`.

4) HTTPS
    - For local HTTPS you’ll need certificates and nginx config updates. For quick local testing, prefer HTTP.

### Wildcard subdomains (*.your-domain) — important ⚠️

- Wildcard DNS does NOT work via the local hosts file. The hosts file cannot match `*.` patterns.
- To use `*.your-domain` (e.g., `*.suryanshverma.live` or `*.suranshverma.site`) with the subdomain proxy feature, create records at your DNS provider (domain registrar/managed DNS):
   - Apex/root: `A @` → your ingress/controller public IP (or a `CNAME @` → your load balancer hostname if supported)
   - Wildcard: `A *.your-domain` → same IP as above (or `CNAME *.your-domain` → `@`)
- For purely local testing on 127.0.0.1, you have options:
   - Add individual host entries per subdomain you plan to test (no wildcard support), or
   - Use a dev wildcard DNS like `nip.io` (e.g., `app.127.0.0.1.nip.io` resolves to 127.0.0.1), or
   - Run a local DNS resolver (e.g., dnsmasq) to handle wildcard to 127.0.0.1.

---

## Services in detail 🔍

- API Server (`scsApiServer/`)
   - Express + TypeScript, mounted routes:
      - `/api/v1` (users, transcoding)
      - `/api/payment` (payments)
      - `/api/host` (static hosting)
      - `/api/v1/object-storage` (MinIO object storage)
      - `/api/v1/cost` (public pricing)
      - `/api/v1/bot` (developer helper endpoints)
   - Integrations: MongoDB (mongoose), BullMQ (Redis), AWS S3 & ECS, Cashfree
   - Special: subdomain proxy to S3 for hosted sites (`BUCKET_HOST_FOR_HOSTING`)

- Frontend (`scscloud/`)
   - React + Vite + Tailwind CSS
   - Dev: http://localhost:5173
   - Docker build arg: `VITE_API_URL` for production image

- Email Worker (`emailServer/`)
   - BullMQ workers for OTP, transcoding complete, API keys, hosting lifecycle, payments
   - Configure via `MY_EMAIL`, `MY_PASSWORD` (use an SMTP provider/app password)

- scs-bot (`scsApiServer/src/bot/`)
   - Conversational assistant for developers and users
   - Uses Groq SDK with LangChain-style tools/function calling
   - Route: `POST /api/v1/bot/chat`
   - Capabilities include quickstart guidance for hosting, HLS transcoding, and object storage snippets

- Transcoding job (`scs-cloud-services/Transcoding-container/`)
   - Inputs via env: `STORAGE_ENDPOINT`, `ACCESS_KEY`, `SECRET_ACCESS_KEY`, `BUCKET_NAME`, `VIDEO_KEY`, `BUCKET_PATH`, `USER_EMAIL`, `QUEUE_*`
   - Downloads source, runs multi-variant FFmpeg, uploads to `BUCKET_PATH/<VIDEO_KEY>/...`, enqueues completion email

- Hosting job (`scs-cloud-services/Hosting-container/`)
   - Inputs via env: `MY_ACCESS_KEY_ID`, `MY_SECRET_ACCESS_KEY`, `MY_BUCKET_NAME`, `WEB_URL`
   - Runs `npm install && npm run build` in the `output` directory if present, then uploads built files to `hosted-websites/<WEB_URL>/...`

- Client helpers (`scs-hls-client/`)
   - `VideoUploadUrl()` and `TranscodeVideo()` wrappers around API flows

---

## Docs and references 📚

- API docs: `scsApiServer/docs/API.md`
- Cost API docs: `scsApiServer/docs/Cost-API.md`
- Frontend config: see `scscloud/vite.config.ts` and `scscloud/nginx.conf`
- Kubernetes quickstart: `k8s/README.md`

---

## UI preview 🖼️

> A peek at the application screens.

![Main page (dark)](./readmeAssets/mainPageUIDark.png)

![Dashboard](./readmeAssets/mainDashboardUI.png)

![Login](./readmeAssets/loginUI.png)

![Object Storage UI](./readmeAssets/objectStorageUI.png)

---

## Environment variables 🔐

Keep secrets out of source control. Key variables by area:

- API server (`scsApiServer`)
   - Core: `PORT`, `MONGO_URI`, `CLIENT_ORIGIN`, `NODE_ENV`, `IS_UNDER_KUBERNETES`
   - Auth: `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `OTP_SECRET`
   - Programmatic creds: `ACCESS_KEY_CREDENTIALS_SECRET`, `SECRET_ACCESS_KEY_CREDENTIALS_SECRET`
   - Bot/3rd‑party: `GROQ_API_KEY`
   - AWS: `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY`, `MY_BUCKET_NAME`, `BUCKET_HOST_FOR_HOSTING`, `HOSTING_DOMAIN`
   - Queue: `QUEUE_HOST`, `QUEUE_USER`, `QUEUE_PASSWORD`, `QUEUE_PORT`
   - Payments/Pricing: `CASHFREE_APP_KEY`, `CASHFREE_APP_SECRET_KEY`, `TRANSCODER_SERVICE_CHARGE`, `HOSTING_SERVICE_CHARGE_PER_30_DAYS`, `STORAGE_PRICE_PER_GB_PER_MONTH_IN_RUPEES`
     - See `scsApiServer/.env.example` for sample values (e.g., `TRANSCODER_SERVICE_CHARGE=0.25`, `HOSTING_SERVICE_CHARGE_PER_30_DAYS=80`, `STORAGE_PRICE_PER_GB_PER_MONTH_IN_RUPEES=15`).

- Email worker (`emailServer`)
   - `MY_EMAIL`, `MY_PASSWORD`, `QUEUE_HOST`, `QUEUE_PORT`, `QUEUE_USER`, `QUEUE_PASSWORD`

- Transcoding container
   - `STORAGE_ENDPOINT`, `ACCESS_KEY`, `SECRET_ACCESS_KEY`, `BUCKET_NAME`, `VIDEO_KEY`, `BUCKET_PATH`, `USER_EMAIL`, plus `QUEUE_*`

- Hosting container
   - `MY_ACCESS_KEY_ID`, `MY_SECRET_ACCESS_KEY`, `MY_BUCKET_NAME`, `WEB_URL`

- Frontend (`scscloud`)
   - `VITE_API_URL` (build-time)

---

## Try it locally 🧪

- API health check: `GET http://localhost:3000/api/v1/health-check`
- Frontend dev server: `http://localhost:5173`
- Upload/transcode flow: see `scs-hls-client/index.js` for the minimal example

---

## Data & persistence 💾

- Compose volumes
   - `./mongo-data` → MongoDB database files
   - `./redis_data` → Redis data (AOF enabled in dev)
- Kubernetes
   - Mongo: `k8s/db/pv.yaml`, `pvc.yaml`, `deployment.yaml`, `svc.yaml`
   - Redis: `k8s/redis-server/*`

---

## Troubleshooting 🧰

- API cannot reach MongoDB/Redis
   - Use service names from Compose (`mongoDb`, `redis`) and verify env (`MONGO_URI`, `QUEUE_*`)
- Emails not sending
   - Use SMTP with app passwords; basic auth is often blocked
- CORS or cookies in dev
   - Set `CLIENT_ORIGIN=http://localhost:5173` and use `withCredentials: true` in the browser app
- Ingress not routing
   - Install the ingress controller; make sure hosts match your setup or port-forward the controller
- Object storage errors
   - Ensure `STORAGE_PRICE_PER_GB_PER_MONTH_IN_RUPEES` is set and that the user has enough SCS Coins for enable/extend endpoints

---

## Contributing 🤝

1. Fork this repository
2. Create a feature branch
3. Commit with clear messages and open a Pull Request

Code style:
- Backend: TypeScript + ESLint defaults; keep controllers/services small and testable
- Frontend: follow Vite/React conventions; prefer functional components and hooks

---

## License 📄

MIT — see `LICENSE`.

---

## Notes

- Irrelevant or generated folders like `node_modules/`, `mongo-data/`, and `redis_data/` are excluded from analysis and should not be committed.
- Secrets are intentionally not included. Create `.env` files locally and Kubernetes Secrets in your cluster before deploying.
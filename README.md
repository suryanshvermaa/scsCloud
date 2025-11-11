# SCS Cloud ☁️

**A Cloud-Native Multi-Service Platform for Modern Web Development**

SCS Cloud is a comprehensive, production-ready cloud platform built as a microservices monorepo. It provides video transcoding (HLS), static website hosting, object storage, container deployment service (similar to AWS ECS, GCP Cloud Run, Azure Container Instances), payment processing, and automated email notifications — all with a modern tech stack and container-native architecture.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](./dockercompose.dev.yaml)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Compatible-326CE5.svg)](./k8s/)

## 🌟 Key Features

### Core Services
- 🎬 **HLS Video Transcoding** — FFmpeg-powered multi-resolution transcoding (1080p/720p/480p/360p) with S3 storage
- 🌐 **Static Website Hosting** — Deploy sites to S3 with automatic subdomain routing and NGINX proxy
- 🗄️ **Object Storage** — MinIO-based storage with programmatic access keys, signed URLs, and per-GB billing
- 🐳 **Container Deployment Service** — Platform's own container orchestration service (like AWS ECS, GCP Cloud Run, Azure Container Instances)
- 💳 **Payment Integration** — Cashfree gateway with SCS Coins wallet system and usage-based deductions
- 🤖 **AI Assistant (scs-bot)** — Groq-powered conversational helper for onboarding, code snippets, and platform guidance
- 📬 **Email Notifications** — BullMQ-powered workers for OTP, payment receipts, deployment notifications, and more

### Infrastructure
- 🐳 **Docker Compose** — Streamlined local development with MongoDB, Redis, PostgreSQL, and email workers
- ☸️ **Kubernetes Ready** — Production manifests with NGINX Ingress, namespaced deployments, and RBAC
- 🔐 **Secure by Design** — JWT authentication, encrypted credentials, signed S3 URLs, and secret management
- 📊 **Scalable Architecture** — gRPC microservices, message queues, and container orchestration

---

## 📂 Repository Structure

```
scsCloud/
├── scsApiServer/          # TypeScript Express API (REST + gRPC client)
│   ├── src/
│   │   ├── bot/          # Groq-powered AI assistant (scs-bot)
│   │   ├── controllers/  # Request handlers for all routes
│   │   ├── routes/       # API endpoint definitions
│   │   ├── models/       # MongoDB schemas (users, payments, websites)
│   │   ├── services/     # AWS S3, ECS, payment gateway integrations
│   │   ├── middleware/   # Auth, CORS, error handling
│   │   └── utils/        # JWT, crypto, helpers
│   ├── docs/            # API documentation
│   └── pb/              # Generated gRPC client stubs
│
├── scscloud/             # React + Vite frontend (TailwindCSS + shadcn/ui)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route-level views
│   │   ├── routes/      # React Router configuration
│   │   ├── utils/       # Frontend helpers
│   │   └── docs/        # User-facing documentation
│   └── nginx.conf       # Production NGINX config
│
├── containerService/     # Go gRPC microservice - SCS Cloud's container deployment service
│   ├── cmd/             # Main application entry point
│   ├── k8s/             # Kubernetes client & resource builders
│   ├── pb/              # Generated gRPC server stubs
│   ├── repository.go    # PostgreSQL data layer
│   ├── service.go       # Business logic
│   └── server.go        # gRPC server (manages container deployments like AWS ECS/GCP Cloud Run/Azure ACI)
│
├── emailServer/          # BullMQ workers + Nodemailer
│   └── src/             # Email job processors (OTP, notifications)
│
├── scs-cloud-services/   # Container workloads for transcoding & hosting
│   ├── Transcoding-container/  # FFmpeg transcoding pipeline
│   └── Hosting-container/      # Static site builder & S3 uploader
│
├── scs-hls-client/       # JavaScript SDK for video upload & transcoding
│
├── k8s/                  # Kubernetes manifests
│   ├── namespace.yaml    # Namespaces (scs-cloud, minio, container-service)
│   ├── ingress.yaml      # NGINX Ingress routing
│   ├── api-server/       # API deployment, service, secrets
│   ├── frontend/         # Frontend deployment, service
│   ├── container-service/ # Container service deployment, RBAC
│   ├── email-server/     # Email worker deployment
│   ├── db/              # MongoDB persistent volume & deployment
│   ├── redis-server/    # Redis deployment
│   ├── postgres_db/     # PostgreSQL for containerService
│   └── nginx-ingress-controller.yaml
│
├── dockercompose.dev.yaml  # Local development stack
└── readmeAssets/           # Architecture diagrams & screenshots
```

### Service Responsibilities

| Service | Technology | Purpose |
|---------|-----------|---------|
| **scsApiServer** | Node.js, TypeScript, Express | REST API, authentication, orchestration, subdomain proxy |
| **scscloud** | React, Vite, TailwindCSS | User interface, dashboards, payment flows |
| **containerService** | Go, gRPC, PostgreSQL | SCS Cloud's container deployment service (like AWS ECS, GCP Cloud Run, Azure ACI) |
| **emailServer** | Node.js, BullMQ, Nodemailer | Background email notifications |
| **Transcoding-container** | FFmpeg, S3 SDK | Video processing pipeline |
| **Hosting-container** | npm, S3 SDK | Static site build & deployment |

---

## 🏗️ Architecture Overview

### System Design

SCS Cloud follows a microservices architecture with clear separation of concerns:

1. **API Gateway Pattern**
   - `scsApiServer` acts as the primary gateway, handling authentication, routing, and orchestration
   - Subdomain proxy: Non-API subdomains (e.g., `mysite.yourdomain.com`) automatically proxy to S3-hosted sites
   - Request flow: `Client → NGINX Ingress → API Server → Services → Databases`

2. **Background Processing**
   - BullMQ + Redis for asynchronous job processing
   - Email workers consume queues for OTP, payment receipts, deployment notifications
   - Decoupled architecture ensures API responsiveness

3. **Container Orchestration**
   - `containerService` is SCS Cloud's own container deployment service (similar to AWS ECS, GCP Cloud Run, Azure Container Instances)
   - gRPC-based API for creating, managing, and deleting container deployments
   - Provisions Kubernetes resources (Deployment/Service/Ingress) automatically
   - Persists deployment metadata and configuration in PostgreSQL
   - Provides users with managed container hosting capabilities

4. **Object Storage Strategy**
   - Local dev: MinIO on `localhost:9000`
   - Kubernetes: Per-user MinIO services (`http://<service>.minio.svc.cluster.local:9000`)
   - API generates signed URLs for secure, temporary access
   - Usage tracking for billing purposes

5. **Payment & Billing Flow**
   ```
   User → Cashfree Gateway → Webhook → API → MongoDB (payment record) 
         → Credit SCS Coins → Queue success email
   ```

### Data Flow Examples

**Video Transcoding Pipeline:**
```
1. User uploads video → API → S3 (raw-videos/)
2. API creates ECS Fargate task (Transcoding-container)
3. Container downloads, transcodes (FFmpeg), uploads HLS outputs
4. Container queues completion email → Email worker sends notification
```

**Static Site Hosting:**
```
1. User provides GitHub repo URL → API creates hosting record
2. API launches ECS task (Hosting-container)
3. Container clones repo, runs npm build, uploads to S3 (hosted-websites/)
4. User accesses site via subdomain: subdomain.yourdomain.com
5. API proxy resolves to S3 bucket, serves index.html
```

### Technology Stack

#### Backend
- **Runtime:** Node.js 22, Go 1.25
- **Frameworks:** Express, gRPC (@grpc/grpc-js)
- **Databases:** MongoDB (Mongoose), PostgreSQL (lib/pq), Redis
- **Queues:** BullMQ (Redis-backed job processing)
- **Payment:** Cashfree SDK

#### Frontend  
- **Framework:** React 18, Vite
- **Styling:** TailwindCSS, shadcn/ui components, Headless UI
- **Routing:** React Router v6
- **State:** React hooks, Axios for API calls
- **UI/UX:** Lucide icons, react-hot-toast, markdown rendering

#### DevOps & Cloud
- **Containerization:** Docker, Docker Compose
- **Orchestration:** Kubernetes (Kind for local), NGINX Ingress
- **Cloud Services:** AWS S3, AWS ECS (Fargate)
- **Object Storage:** MinIO (on-premises/k8s)
- **Media Processing:** FFmpeg

#### AI/ML
- **scs-bot:** Groq SDK (LLM inference), function calling for tool use

---

## 📸 Visual Architecture

> High-level system diagrams and UI previews (see `readmeAssets/`)

### System Architecture Diagrams

<table>
<tr>
<td width="50%">

**Kubernetes Architecture**
![Kubernetes Architecture](./readmeAssets/k8sArchitecture.png)

</td>
<td width="50%">

**Transcoding Service**
![Transcoding Service Architecture](./readmeAssets/trascodingServiceArchitecture.png)

</td>
</tr>
<tr>
<td width="50%">

**Hosting Service**
![Hosting Service Architecture](./readmeAssets/hostingServiceArchitecture.png)

</td>
<td width="50%">

**Object Storage**
![Object Storage Architecture](./readmeAssets/objectStorageArchitecture.png)

</td>
</tr>
</table>

### Application Screenshots

<table>
<tr>
<td width="50%">

**Main Dashboard**
![Main Dashboard](./readmeAssets/mainDashboardUI.png)

</td>
<td width="50%">

**Dark Mode**
![Main Page Dark Mode](./readmeAssets/mainPageUIDark.png)

</td>
</tr>
<tr>
<td width="50%">

**Authentication**
![Login UI](./readmeAssets/loginUI.png)

</td>
<td width="50%">

**Object Storage Interface**
![Object Storage UI](./readmeAssets/objectStorageUI.png)

</td>
</tr>
</table>

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Docker Desktop** (with WSL2 backend on Windows) — [Download](https://www.docker.com/products/docker-desktop)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **Go 1.25+** (for containerService) — [Download](https://go.dev/dl/)
- **kubectl** & **kind** (for Kubernetes) — [kubectl](https://kubernetes.io/docs/tasks/tools/), [kind](https://kind.sigs.k8s.io/)
- **PostgreSQL 14+** (or use Docker Compose)
- **Git** for cloning the repository

### Quick Start with Docker Compose

This method starts MongoDB, Redis, PostgreSQL, and the email worker locally.

#### 1. Clone the Repository

```bash
git clone https://github.com/suryanshvermaa/scsCloud.git
cd scsCloud
```

#### 2. Create Environment Files

Create `.env.dev` in the root directory for Docker Compose:

```bash
# Database credentials
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=your_secure_password

# Redis configuration
REDIS_PASSWORD=your_redis_password

# Email worker configuration
MY_EMAIL=your_smtp_email@example.com
MY_PASSWORD=your_smtp_app_password
QUEUE_PASSWORD=your_redis_password
```

Create `scsApiServer/.env` for the API server (see `scsApiServer/.env.example`):

```bash
cd scsApiServer
cp .env.example .env
# Edit .env with your configuration
```

Create `emailServer/.env`:

```bash
cd emailServer
cat > .env <<'EOF'
MY_EMAIL=your_smtp_email@example.com
MY_PASSWORD=your_smtp_app_password
QUEUE_HOST=localhost
QUEUE_PORT=6379
QUEUE_USER=default
QUEUE_PASSWORD=your_redis_password
EOF
```

#### 3. Start Infrastructure Services

```bash
# From the root directory
docker compose -f dockercompose.dev.yaml up -d
```

This launches:
- MongoDB on `localhost:27017`
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`
- Email worker container

Verify services are running:

```bash
docker compose -f dockercompose.dev.yaml ps
```

#### 4. Run the API Server

```bash
cd scsApiServer
npm install
npm run dev
```

API will be available at `http://localhost:3000`

#### 5. Run the Frontend

In a new terminal:

```bash
cd scscloud
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

#### 6. (Optional) Run Container Service

In a new terminal:

```bash
cd containerService
go run ./cmd/containerService
```

gRPC service will be available at `localhost:8080`

#### 7. Test the Setup

- Health check: `curl http://localhost:3000/api/v1/health-check`
- Frontend: Open `http://localhost:5173` in your browser
- gRPC: `grpcurl -plaintext localhost:8080 list`

#### 8. Stop Services

```bash
docker compose -f dockercompose.dev.yaml down
```
---

## ☸️ Kubernetes Deployment

Deploy SCS Cloud to a local Kind cluster with NGINX Ingress.

### Prerequisites

- `kind` installed ([Installation guide](https://kind.sigs.k8s.io/docs/user/quick-start/))
- `kubectl` configured
- Docker running

### Deployment Steps

#### 1. Create Kind Cluster

```bash
kind create cluster --name suryansh-cluster --config ./k8s/cluster.yaml
```

#### 2. Install NGINX Ingress Controller

```bash
kubectl apply -f ./k8s/nginx-ingress-controller.yaml

# Wait for ingress controller to be ready
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s
```

#### 3. Create Namespaces

```bash
kubectl apply -f ./k8s/namespace.yaml
```

This creates:
- `scs-cloud` (main application namespace)
- `minio` (object storage namespace)
- `container-service` (alternative namespace, not used by default)

#### 4. Deploy Databases

```bash
# MongoDB
kubectl apply -f ./k8s/db/

# Redis
kubectl apply -f ./k8s/redis-server/

# PostgreSQL (for containerService)
kubectl apply -f ./k8s/postgres_db/
```

#### 5. Create Secrets

Before deploying application services, create necessary secrets:

```bash
# Example: API server secrets
kubectl create secret generic api-secrets -n scs-cloud \
  --from-literal=MONGO_URI='mongodb://root:password@mongodb-service.scs-cloud.svc.cluster.local:27017' \
  --from-literal=ACCESS_TOKEN_SECRET='your-access-token-secret' \
  --from-literal=REFRESH_TOKEN_SECRET='your-refresh-token-secret' \
  # ... add other required secrets
```

**Important:** Secrets are not included in this repository. Refer to service-specific `.env.example` files for required secret keys.

#### 6. Deploy Application Services

```bash
# Email worker
kubectl apply -f ./k8s/email-server/

# API server
kubectl apply -f ./k8s/api-server/

# Container service
kubectl apply -f ./k8s/container-service/

# Frontend
kubectl apply -f ./k8s/frontend/

# Ingress routing
kubectl apply -f ./k8s/ingress.yaml
```

#### 7. Verify Deployment

```bash
# Check all pods in scs-cloud namespace
kubectl get pods -n scs-cloud --watch

# Check services
kubectl get svc -n scs-cloud

# Check ingress
kubectl get ingress -n scs-cloud
```

#### 8. Access the Application

##### Option A: Port Forwarding (Recommended for Local)

```bash
# Forward to port 3000 (no admin privileges required)
kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 3000:80

# Access services:
# Frontend: http://suryanshverma.live:3000
# API: http://api.suryanshverma.live:3000
```

##### Option B: Direct Port 80 (Requires Admin)

```bash
# Forward to port 80 (requires sudo on Linux/macOS)
kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 80:80

# Access services:
# Frontend: http://suryanshverma.live
# API: http://api.suryanshverma.live
```

#### 9. Configure Local DNS

Add entries to your hosts file:

**Linux/macOS:** `/etc/hosts`
**Windows:** `C:\Windows\System32\drivers\etc\hosts`

```
127.0.0.1  suryanshverma.live
127.0.0.1  api.suryanshverma.live
```

### Wildcard Subdomains (Advanced)

For subdomain-based hosted sites (e.g., `mysite.suryanshverma.live`):

**Option 1: Individual Host Entries**
```
127.0.0.1  site1.suryanshverma.live
127.0.0.1  site2.suryanshverma.live
```

**Option 2: Use nip.io (No DNS setup required)**
```bash
# Access via patterns like:
# http://app.127.0.0.1.nip.io:3000
```

**Option 3: Local DNS Resolver**
- Run dnsmasq or similar to handle wildcard DNS locally
- Configure wildcard `*.suryanshverma.live → 127.0.0.1`

**Option 4: Real DNS (Production)**
- Configure DNS A records at your domain registrar:
  - `@ → your-server-ip`
  - `*.yourdomain.com → your-server-ip`

### Cleanup

```bash
# Delete all resources
kubectl delete -f ./k8s/ingress.yaml
kubectl delete -f ./k8s/frontend/
kubectl delete -f ./k8s/container-service/
kubectl delete -f ./k8s/api-server/
kubectl delete -f ./k8s/email-server/
kubectl delete -f ./k8s/postgres_db/
kubectl delete -f ./k8s/redis-server/
kubectl delete -f ./k8s/db/
kubectl delete -f ./k8s/namespace.yaml

# Delete the cluster
kind delete cluster --name suryansh-cluster
```
```

2) Start the dev stack:

```bash
docker compose -f dockercompose.dev.yaml up -d
```

This launches MongoDB, Redis, and the email worker. MongoDB and Redis are internal to the Compose network.

3) Run the API server (separate terminal):

```bash
cd scsApiServer
npm install
npm run dev
```

4) Run the frontend (separate terminal):

```bash
cd scscloud
npm install
npm run dev
```

5) Stop everything:

```bash
docker compose -f dockercompose.dev.yaml down
```

Tip: The root `docker-compose.yml` contains a similar minimal stack (MongoDB, Redis, Email worker).

---

## Kubernetes deployment ☸️

Manifests are under `k8s/` and now include namespaces for `scs-cloud`, `minio`, and `container-service`, plus a separate `postgres_db` directory for the container service database. Example workflow (Kind + NGINX Ingress). Adjust hosts in `k8s/ingress.yaml` to your domain or use port-forwarding.

```bash
# Create local Kind cluster
kind create cluster --name suryansh-cluster --config ./k8s/cluster.yaml

# Install NGINX Ingress Controller
kubectl apply -f ./k8s/nginx-ingress-controller.yaml

# Namespaces, MongoDB, Redis
kubectl apply -f ./k8s/namespace.yaml -f ./k8s/db -f ./k8s/redis-server

# Optional: Postgres DB for containerService (if deploying it)
kubectl apply -f ./k8s/postgres_db

# App services (ensure Secrets exist first): email, API, container-service, frontend, ingress
kubectl apply -f ./k8s/email-server -f ./k8s/api-server -f ./k8s/container-service -f ./k8s/frontend -f ./k8s/ingress.yaml

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
    - Alternatively, add OS hosts file entries:
       - Linux/macOS: `/etc/hosts`
       - Windows: `C:\\Windows\\System32\\drivers\\etc\\hosts`
       - Add:
          - `127.0.0.1  suryanshverma.live`
          - `127.0.0.1  api.suryanshverma.live`

2) Port-forward the ingress controller
    - Easiest (no admin ports):
       - `kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 3000:80`
       - Browse with explicit port:
          - Frontend → `http://suryanshverma.live:3000`
          - API → `http://api.suryanshverma.live:3000`
    - Optional (may require elevated privileges):
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

## 🔍 Service Details

### API Server (`scsApiServer/`)

**Technology:** Node.js, TypeScript, Express, MongoDB, Redis

**Key Features:**
- RESTful API with JWT authentication
- Subdomain proxy for hosted static sites
- gRPC client for containerService
- BullMQ job queue integration
- AWS S3 & ECS orchestration

**API Routes:**

| Route | Purpose |
|-------|---------|
| `/api/v1/auth/*` | User authentication (signup, login, OTP) |
| `/api/v1/user/*` | User profile and account management |
| `/api/v1/transcoding/*` | Video upload and transcoding orchestration |
| `/api/v1/object-storage/*` | MinIO object storage management |
| `/api/v1/bot/*` | AI assistant endpoints |
| `/api/v1/cost` | Public pricing information |
| `/api/v1/health-check` | Service health status |
| `/api/payment/*` | Cashfree payment flows |
| `/api/host/*` | Static website hosting |

**Configuration:**
- Port: `3000` (default)
- Environment: See `scsApiServer/.env.example`
- Documentation: `scsApiServer/docs/`

**Development:**
```bash
cd scsApiServer
npm install
npm run dev     # Development with hot reload
npm run build   # TypeScript compilation
npm start       # Production
```

---

### Frontend (`scscloud/`)

**Technology:** React 18, Vite, TailwindCSS, shadcn/ui

**Key Features:**
- Modern, responsive UI with dark mode support
- Dashboard for transcoding, hosting, and storage
- Real-time payment integration (Cashfree)
- Interactive AI assistant (scs-bot)
- Markdown documentation viewer

**Pages:**
- Landing page with feature showcase
- User authentication (login, signup, OTP verification)
- Dashboard (overview, usage stats)
- Video transcoding interface
- Static site hosting manager
- Object storage browser
- Payment and billing
- API documentation

**Configuration:**
- Dev server: `localhost:5173`
- Build argument: `VITE_API_URL` (for production)
- NGINX config: `nginx.conf` (for production deployment)

**Development:**
```bash
cd scscloud
npm install
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

---

### Container Service (`containerService/`)

**Technology:** Go 1.25, gRPC, PostgreSQL, Kubernetes client-go

**Overview:**
The Container Service is SCS Cloud's own container deployment platform, providing functionality similar to AWS ECS, GCP Cloud Run, and Azure Container Instances. It allows users to deploy and manage containerized applications through a simple gRPC API.

**Key Features:**
- gRPC API for container deployment management
- Automatic Kubernetes resource provisioning (Deployment, Service, Ingress)
- PostgreSQL persistence with JSONB support for environment variables
- Server reflection enabled for easy testing with grpcurl
- Multi-user deployment isolation and tracking
- Declarative container configuration (image, CPU, memory, replicas, ports, env vars)

**gRPC Methods:**

| RPC | Request | Response | Purpose |
|-----|---------|----------|---------|
| `GetDeployments` | `{ user_id }` | `[Deployment]` | List all container deployments for a user |
| `CreateDeployment` | `Deployment` | `Deployment` | Create new container deployment with auto K8s provisioning |
| `DeleteDeployment` | `{ deployment_id }` | `Status` | Remove container deployment and clean up resources |

**Data Model:**
```sql
deployments (
  id UUID PRIMARY KEY,
  user_id VARCHAR,
  namespace VARCHAR,
  name VARCHAR,
  docker_image VARCHAR,
  cpu VARCHAR,
  memory VARCHAR,
  replicas INT,
  port INT,
  environments JSONB,
  created_at TIMESTAMP
)
```

**Development:**
```bash
cd containerService

# Start PostgreSQL
docker compose up -d

# Run service
go run ./cmd/containerService

# Test with grpcurl
grpcurl -plaintext localhost:8080 list
grpcurl -plaintext -d '{"user_id":"test"}' \
  localhost:8080 pb.ContainerService/GetDeployments
```

**Configuration:**
- Port: `8080` (local), `4000` (k8s)
- Database: PostgreSQL via `DATABASE_URL`
- Kubernetes: Uses `~/.kube/config` for cluster access in development
- Target Platform: Kubernetes (provisions Deployment/Service/Ingress resources)

**Use Cases:**
- Provide users with managed container hosting (like Heroku, Railway, Render)
- Deploy user applications to Kubernetes without users needing K8s knowledge
- Track and bill container resource usage per user
- Provision isolated namespaced deployments for each user
- Offer a container-as-a-service platform within SCS Cloud

**How It Works:**
1. User makes gRPC call to create deployment with container specs
2. Service saves deployment record to PostgreSQL
3. Service provisions Kubernetes Deployment, Service, and Ingress
4. Container is deployed and accessible via generated subdomain
5. Users can list, manage, and delete their deployments via API

---

### Email Worker (`emailServer/`)

**Technology:** Node.js, BullMQ, Nodemailer

**Job Types:**
- `sendOTPEmail` — User authentication OTPs
- `sendTranscodeCompleteEmail` — Video transcoding completion
- `sendHostingCompleteEmail` — Site deployment success
- `sendPaymentSuccessEmail` — Payment confirmation
- `sendAccessKeysEmail` — API key generation notification

**Configuration:**
```env
MY_EMAIL=your@email.com
MY_PASSWORD=your_app_password
QUEUE_HOST=localhost
QUEUE_PORT=6379
QUEUE_USER=default
QUEUE_PASSWORD=redis_password
```

**Development:**
```bash
cd emailServer
npm install
npm run dev
```

---

### Transcoding Container (`scs-cloud-services/Transcoding-container/`)

**Purpose:** Convert videos to multi-resolution HLS format

**Process:**
1. Download source video from S3 (`raw-videos/<VIDEO_KEY>`)
2. Transcode with FFmpeg to multiple resolutions:
   - 1080p (1920x1080, 5000k bitrate)
   - 720p (1280x720, 2800k bitrate)
   - 480p (854x480, 1400k bitrate)
   - 360p (640x360, 800k bitrate)
3. Generate HLS master playlist
4. Upload outputs to S3 (`<BUCKET_PATH>/<VIDEO_KEY>/`)
5. Queue completion email

**Environment Variables:**
```bash
STORAGE_ENDPOINT=s3.amazonaws.com
ACCESS_KEY=your_access_key
SECRET_ACCESS_KEY=your_secret_key
BUCKET_NAME=your_bucket
VIDEO_KEY=unique_video_id
BUCKET_PATH=transcoded-videos
USER_EMAIL=user@example.com
QUEUE_HOST=localhost
QUEUE_PORT=6379
```

---

### Hosting Container (`scs-cloud-services/Hosting-container/`)

**Purpose:** Build and deploy static websites to S3

**Process:**
1. Clone Git repository (or use pre-populated source)
2. Run `npm install && npm run build`
3. Upload built files to S3 (`hosted-websites/<WEB_URL>/`)
4. Site becomes accessible via subdomain

**Environment Variables:**
```bash
MY_ACCESS_KEY_ID=your_access_key
MY_SECRET_ACCESS_KEY=your_secret_key
MY_BUCKET_NAME=your_bucket
WEB_URL=mysite
```

---

### HLS Client SDK (`scs-hls-client/`)

**Purpose:** Simplified JavaScript SDK for video operations

**Functions:**
```javascript
// Get signed upload URL
const uploadUrl = await VideoUploadUrl(apiUrl, token);

// Upload video file
await uploadVideo(file, uploadUrl);

// Start transcoding
await TranscodeVideo(apiUrl, token, videoKey);
```

---

## 🔐 Environment Configuration

### API Server (`scsApiServer/.env`)

**Core Settings:**
```bash
NODE_ENV=development
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
IS_UNDER_KUBERNETES=false
```

**Database & Cache:**
```bash
MONGO_URI=mongodb://root:password@localhost:27017
QUEUE_HOST=localhost
QUEUE_PORT=6379
QUEUE_USER=default
QUEUE_PASSWORD=your_redis_password
```

**Authentication Secrets:**
```bash
ACCESS_TOKEN_SECRET=your_access_token_secret_min_32_chars
REFRESH_TOKEN_SECRET=your_refresh_token_secret_min_32_chars
OTP_SECRET=your_otp_secret_min_32_chars
ACCESS_KEY_CREDENTIALS_SECRET=your_access_key_secret
SECRET_ACCESS_KEY_CREDENTIALS_SECRET=your_secret_key_secret
```

**AI Assistant:**
```bash
GROQ_API_KEY=your_groq_api_key
```

**AWS Configuration:**
```bash
ACCESS_KEY_ID=your_aws_access_key
SECRET_ACCESS_KEY=your_aws_secret_key
MY_BUCKET_NAME=your-s3-bucket
BUCKET_HOST_FOR_HOSTING=https://your-bucket.s3.amazonaws.com
HOSTING_DOMAIN=yourdomain.com

# ECS Configuration
CLUSTER_ARN=arn:aws:ecs:region:account:cluster/your-cluster
TRANSCODER_TASK_DEFINITION_ARN=arn:aws:ecs:region:account:task-definition/transcoder
HOSTER_TASK_DEFINITION_ARN=arn:aws:ecs:region:account:task-definition/hoster
TRANSCODER_TASK_NAME=transcoder-task
HOSTER_TASK_NAME=hoster-task
MY_SUBNET_1=subnet-xxxxxx
MY_SUBNET_2=subnet-yyyyyy
MY_SECURITY_GROUP=sg-zzzzzzz
```

**Payment Gateway:**
```bash
CASHFREE_APP_KEY=your_cashfree_app_key
CASHFREE_APP_SECRET_KEY=your_cashfree_secret_key
```

**Pricing Configuration:**
```bash
# Service charges (in rupees)
TRANSCODER_SERVICE_CHARGE=0.25
HOSTING_SERVICE_CHARGE_PER_30_DAYS=80
STORAGE_PRICE_PER_GB_PER_MONTH_IN_RUPEES=15
```

---

### Email Server (`emailServer/.env`)

```bash
MY_EMAIL=your_smtp_email@example.com
MY_PASSWORD=your_smtp_app_password
QUEUE_HOST=localhost
QUEUE_PORT=6379
QUEUE_USER=default
QUEUE_PASSWORD=your_redis_password
```

**SMTP Providers:**
- Gmail: Enable 2FA and use App Password
- SendGrid, Mailgun, AWS SES are also supported

---

### Container Service (`containerService/.env`)

```bash
DATABASE_URL=postgres://scsuser:scspassword@localhost:5432/scsdb?sslmode=disable
PORT=8080
```

---

### Frontend (`scscloud/.env`)

```bash
# Build-time variable
VITE_API_URL=http://localhost:3000
```

For production builds:
```bash
docker build --build-arg VITE_API_URL=https://api.yourdomain.com -t scscloud .
```

---

### Security Best Practices

1. **Never commit `.env` files** — Use `.env.example` as templates
2. **Use strong secrets** — Minimum 32 characters for JWT secrets
3. **Rotate credentials regularly** — Especially for production environments
4. **Use Kubernetes Secrets** — For cluster deployments, encode secrets in base64:
   ```bash
   echo -n 'your-secret' | base64
   ```
5. **Enable HTTPS in production** — Use Let's Encrypt with cert-manager on Kubernetes
6. **Restrict CORS origins** — Set `CLIENT_ORIGIN` to specific domains, not `*`
7. **Use IAM roles** — For AWS services in production instead of static credentials

---

## 🧪 Testing & Development

### API Testing

**Health Check:**
```bash
curl http://localhost:3000/api/v1/health-check
```

**Test Authentication:**
```bash
# Signup
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'
```

**Test gRPC Service:**
```bash
# List available services
grpcurl -plaintext localhost:8080 list

# Get deployments for a user
grpcurl -plaintext -d '{"user_id":"test-user"}' \
  localhost:8080 pb.ContainerService/GetDeployments
```

### Frontend Development

**Hot Module Replacement:**
```bash
cd scscloud
npm run dev
# Edit files in src/ - changes reflect instantly
```

**Build Production Assets:**
```bash
npm run build
npm run preview  # Test production build locally
```

### Database Access

**MongoDB:**
```bash
# Connect via mongosh
docker exec -it mongodb mongosh -u root -p example

# List databases
show dbs
use scsCloud
show collections
```

**PostgreSQL:**
```bash
# Connect via psql
docker exec -it <postgres-container-name> psql -U scsuser -d scsdb

# List tables
\dt
SELECT * FROM deployments;
```

**Redis:**
```bash
# Connect via redis-cli
docker exec -it redis redis-cli

# List keys
KEYS *
GET key_name
```

### Debugging

**Enable Debug Logs:**
```bash
# API Server
DEBUG=* npm run dev

# Container Service
go run ./cmd/containerService  # Logs to stdout
```

**Monitor BullMQ Queues:**
```javascript
// In scsApiServer, add to your code:
const { Queue } = require('bullmq');
const queue = new Queue('emailQueue', { connection: redisConnection });

// Check queue stats
const counts = await queue.getJobCounts();
console.log(counts);  // { waiting, active, completed, failed }
```

---

## 🧰 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed

**Symptoms:** `MongoServerError: Authentication failed`

**Solutions:**
- Verify `MONGO_URI` in `.env` matches Docker Compose credentials
- Check MongoDB is running: `docker ps | grep mongodb`
- Wait for MongoDB to fully start (can take 10-20 seconds)
- Reset MongoDB: `docker compose down -v && docker compose up -d`

#### 2. Redis Connection Refused

**Symptoms:** `Error: connect ECONNREFUSED 127.0.0.1:6379`

**Solutions:**
- Ensure Redis is running: `docker ps | grep redis`
- Check `QUEUE_HOST` and `QUEUE_PORT` in `.env`
- Verify Redis is accessible: `redis-cli ping`

#### 3. CORS Errors in Browser

**Symptoms:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
- Set `CLIENT_ORIGIN=http://localhost:5173` in `scsApiServer/.env`
- Ensure frontend uses `withCredentials: true` for authenticated requests
- Check API is running on expected port (3000)
- Clear browser cookies and restart both services

#### 4. Kubernetes Pod CrashLoopBackOff

**Symptoms:** Pod restarts continuously

**Solutions:**
```bash
# Check pod logs
kubectl logs -n scs-cloud <pod-name>

# Describe pod for events
kubectl describe pod -n scs-cloud <pod-name>

# Common causes:
# - Missing secrets: kubectl get secrets -n scs-cloud
# - Wrong image tag: check deployment YAML
# - Port mismatch: verify containerPort matches app PORT
# - Database not ready: check MongoDB/Postgres pods first
```

#### 5. Ingress Not Routing

**Symptoms:** 404 or connection refused on domain

**Solutions:**
```bash
# Check ingress controller is running
kubectl get pods -n ingress-nginx

# Verify ingress resource
kubectl get ingress -n scs-cloud
kubectl describe ingress -n scs-cloud scs-cloud-ingress

# Check service endpoints
kubectl get endpoints -n scs-cloud

# Port forward directly to service for testing
kubectl port-forward -n scs-cloud svc/scs-cloud-app-service 3000:3000
```

#### 6. Container Service gRPC Errors

**Symptoms:** `rpc error: code = Unavailable`

**Solutions:**
- Check PostgreSQL is running and accessible
- Verify `DATABASE_URL` format is correct
- Add `CREATE EXTENSION IF NOT EXISTS pgcrypto;` to `up.sql` if UUID errors occur
- Ensure port 8080 (or 4000 in k8s) is not in use
- Verify Kubernetes cluster is accessible (check `~/.kube/config`)
- Check RBAC permissions for creating Deployments/Services/Ingress
- Ensure target namespace exists in Kubernetes cluster
- Verify service account has required cluster permissions

#### 7. Email Not Sending

**Symptoms:** Jobs stuck in queue or failed

**Solutions:**
- Use SMTP app passwords (not regular passwords)
- Gmail: Enable 2FA and create App Password
- Check email worker logs: `docker logs emailserver`
- Verify `MY_EMAIL`, `MY_PASSWORD` are correct
- Test SMTP connection independently with nodemailer

#### 8. Object Storage Access Denied

**Symptoms:** `AccessDenied` errors from S3/MinIO

**Solutions:**
- Verify AWS credentials in `.env`
- Check S3 bucket policy allows your IAM user
- Ensure `STORAGE_PRICE_PER_GB_PER_MONTH_IN_RUPEES` is set
- Verify user has enough SCS Coins for storage operations
- Check signed URL hasn't expired

#### 9. FFmpeg Transcoding Fails

**Symptoms:** Transcoding task exits with error

**Solutions:**
- Verify source video file exists in S3
- Check video format is supported (MP4, AVI, MOV, etc.)
- Ensure sufficient disk space in container
- Review FFmpeg logs in ECS task logs
- Validate S3 credentials in task environment

#### 10. Payment Integration Issues

**Symptoms:** Payment callbacks not received

**Solutions:**
- Verify Cashfree webhook URL is accessible from internet
- Use ngrok for local development: `ngrok http 3000`
- Check `CASHFREE_APP_KEY` and `CASHFREE_APP_SECRET_KEY`
- Review Cashfree dashboard for webhook delivery status
- Ensure webhook signature validation is correct

---

## 📚 Documentation

### API Documentation
- **Main API:** `scsApiServer/docs/API.md` — Complete REST API reference
- **Cost API:** `scsApiServer/docs/Cost-API.md` — Pricing and billing endpoints
- **Frontend Docs:** `scscloud/src/docs/` — User-facing guides

### Service-Specific
- **Container Service:** `containerService/README.md` — gRPC API for SCS Cloud's container deployment service (similar to AWS ECS, GCP Cloud Run, Azure ACI)
- **Kubernetes:** `k8s/README.md` — Cluster setup and manifest documentation

### Configuration Files
- **Vite Config:** `scscloud/vite.config.ts` — Frontend build settings
- **NGINX Config:** `scscloud/nginx.conf` — Production server config
- **Docker Compose:** `dockercompose.dev.yaml` — Local development stack
- **Kind Cluster:** `k8s/cluster.yaml` — Kubernetes cluster configuration

---

## 💾 Data Persistence

### Docker Compose Volumes

| Volume | Path | Purpose |
|--------|------|---------|
| MongoDB | `./mongo-data/` | Database files (users, payments, websites) |
| Redis | `./redis_data/` | AOF persistence and snapshots |
| PostgreSQL | `postgres_data_v0` | Container service deployments |

**Backup Strategy:**
```bash
# Backup MongoDB
docker exec mongodb mongodump --out /backup --username root --password example
docker cp mongodb:/backup ./backup-$(date +%Y%m%d)

# Backup PostgreSQL
docker exec <postgres-container> pg_dump -U scsuser scsdb > backup-$(date +%Y%m%d).sql

# Backup Redis
docker exec redis redis-cli SAVE
docker cp redis:/data/dump.rdb ./redis-backup-$(date +%Y%m%d).rdb
```

### Kubernetes Persistent Volumes

**MongoDB:**
- PV: `k8s/db/pv.yaml` (hostPath for local, use CSI in production)
- PVC: `k8s/db/pvc.yaml` (10Gi claim)
- Mount: `/data/db` in MongoDB pod

**Redis:**
- PV: `k8s/redis-server/pv.yaml`
- PVC: `k8s/redis-server/pvc.yaml` (5Gi)
- Mount: `/data` in Redis pod

**PostgreSQL:**
- PV: `k8s/postgres_db/pv.yaml`
- PVC: `k8s/postgres_db/pvc.yaml` (5Gi)
- Mount: `/var/lib/postgresql/data`

**Production Considerations:**
- Use cloud-provider CSI drivers (AWS EBS, GCE PD, Azure Disk)
- Implement automated backup solutions (Velero, custom CronJobs)
- Enable point-in-time recovery for critical databases
- Consider StatefulSets for databases instead of Deployments

---

## 🚀 Deployment Strategies

### Local Development (Docker Compose)

**Pros:**
- Fast iteration
- Easy debugging
- No cluster overhead

**Cons:**
- Not production-like
- Single host limitations

**Best for:** Feature development, testing new APIs

---

### Local Kubernetes (Kind)

**Pros:**
- Production-like environment
- Multi-service orchestration
- Ingress testing

**Cons:**
- Resource intensive
- Slower than Compose
- More complex setup

**Best for:** Integration testing, deployment validation, learning Kubernetes

---

### Cloud Kubernetes (EKS/GKE/AKS)

**Pros:**
- Scalable infrastructure
- Managed control plane
- Cloud integration (load balancers, storage)

**Cons:**
- Cost considerations
- More complex networking
- Cloud-specific configurations

**Best for:** Production workloads, staging environments

**Setup Steps:**
1. Provision managed Kubernetes cluster
2. Configure kubectl context
3. Update storage classes (remove `hostPath`, use cloud CSI)
4. Configure external load balancer in ingress
5. Set up DNS records for your domain
6. Deploy cert-manager for HTTPS (Let's Encrypt)
7. Configure horizontal pod autoscaling
8. Set up monitoring (Prometheus, Grafana)

---

## 🔒 Production Checklist

### Security
- [ ] Rotate all secrets and use strong passwords (32+ characters)
- [ ] Enable HTTPS with valid SSL certificates
- [ ] Configure network policies in Kubernetes
- [ ] Use least-privilege RBAC roles (not cluster-admin)
- [ ] Enable pod security policies/admission controllers
- [ ] Implement rate limiting on API endpoints
- [ ] Set up Web Application Firewall (WAF)
- [ ] Enable audit logging for Kubernetes API
- [ ] Use secret management tools (HashiCorp Vault, AWS Secrets Manager)
- [ ] Scan container images for vulnerabilities

### Performance
- [ ] Configure resource requests and limits
- [ ] Set up horizontal pod autoscaling (HPA)
- [ ] Enable Redis persistence (AOF + RDB)
- [ ] Configure MongoDB replica sets
- [ ] Set up CDN for static assets
- [ ] Enable gzip/brotli compression
- [ ] Implement caching strategies (Redis, CloudFront)
- [ ] Optimize database indexes
- [ ] Configure connection pooling

### Monitoring & Observability
- [ ] Set up Prometheus for metrics collection
- [ ] Configure Grafana dashboards
- [ ] Implement structured logging (JSON format)
- [ ] Set up log aggregation (ELK stack, CloudWatch)
- [ ] Configure alerting (PagerDuty, Slack)
- [ ] Set up distributed tracing (Jaeger, Zipkin)
- [ ] Monitor application performance (APM tools)
- [ ] Track business metrics (user signups, transcoding jobs)

### Reliability
- [ ] Configure health checks and readiness probes
- [ ] Set up database backups (automated, tested)
- [ ] Implement disaster recovery procedures
- [ ] Configure pod disruption budgets
- [ ] Set up multi-zone/region deployments
- [ ] Test failover scenarios
- [ ] Document incident response procedures
- [ ] Configure queue dead letter queues

### Compliance
- [ ] Implement data retention policies
- [ ] Configure GDPR-compliant data deletion
- [ ] Set up audit trails for sensitive operations
- [ ] Document data flow and storage locations
- [ ] Implement terms of service acceptance tracking
- [ ] Configure privacy policy acknowledgment

---

## 🤝 Contributing

We welcome contributions to SCS Cloud! Here's how you can help:

### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/scsCloud.git
   cd scsCloud
   git remote add upstream https://github.com/suryanshvermaa/scsCloud.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style and conventions
   - Add tests for new features
   - Update documentation as needed

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add video quality selection to transcoding"
   ```

   **Commit message format:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

5. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Go to GitHub and create a Pull Request
   - Describe your changes clearly
   - Reference any related issues

### Code Style Guidelines

**TypeScript (API Server, Frontend):**
- Use TypeScript strict mode
- Prefer functional components and hooks (React)
- Use async/await over promises
- Follow ESLint rules (run `npm run lint`)
- Add JSDoc comments for public APIs

**Go (Container Service):**
- Follow Go standard formatting (`gofmt`)
- Use meaningful variable names
- Add godoc comments for exported functions
- Handle errors explicitly

**General:**
- Keep functions small and focused (< 50 lines)
- Write self-documenting code
- Add comments for complex logic
- Use meaningful commit messages

### Testing

- Write unit tests for business logic
- Add integration tests for API endpoints
- Test error handling scenarios
- Verify CORS and authentication flows

### Documentation

- Update README.md for new features
- Add API documentation in `docs/` folders
- Update environment variable examples
- Include architecture diagrams for major changes

### Areas for Contribution

**Priority:**
- [ ] Unit and integration tests
- [ ] API rate limiting implementation
- [ ] Kubernetes horizontal pod autoscaling
- [ ] Database migration system
- [ ] WebSocket support for real-time updates
- [ ] Enhanced Container Service features (auto-scaling, health checks, rollback support)

**Features:**
- [ ] Additional video codecs (AV1, VP9)
- [ ] Multi-region S3 support
- [ ] Advanced object storage features (versioning, lifecycle policies)
- [ ] User analytics dashboard
- [ ] Terraform/Pulumi infrastructure as code
- [ ] Container deployment templates for common stacks (Node.js, Python, Go)
- [ ] Custom domain support for container deployments

**Improvements:**
- [ ] Performance optimizations
- [ ] Better error messages
- [ ] Improved logging
- [ ] Enhanced security measures
- [ ] Mobile-responsive UI improvements

---

## 📝 Changelog

### Version 1.0.0 (Current)

**Features:**
- HLS video transcoding with multi-resolution support
- Static website hosting with subdomain routing
- Object storage with MinIO integration
- Container deployment service (similar to AWS ECS, GCP Cloud Run, Azure Container Instances)
- Payment processing with Cashfree
- AI assistant (scs-bot) powered by Groq
- Email notifications via BullMQ
- Kubernetes deployment manifests
- Docker Compose development environment

**Components:**
- API Server (Node.js/TypeScript)
- Frontend (React/Vite)
- Container Service (Go/gRPC) — SCS Cloud's container hosting platform
- Email Worker (BullMQ/Nodemailer)
- Transcoding Container (FFmpeg)
- Hosting Container (npm/S3)

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Suryansh Verma

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

**Technologies:**
- [Node.js](https://nodejs.org/) — JavaScript runtime
- [React](https://react.dev/) — UI framework
- [Go](https://go.dev/) — Systems programming language
- [Kubernetes](https://kubernetes.io/) — Container orchestration
- [Docker](https://www.docker.com/) — Containerization platform
- [MongoDB](https://www.mongodb.com/) — NoSQL database
- [Redis](https://redis.io/) — In-memory data store
- [PostgreSQL](https://www.postgresql.org/) — Relational database
- [FFmpeg](https://ffmpeg.org/) — Media processing
- [TailwindCSS](https://tailwindcss.com/) — CSS framework
- [Vite](https://vitejs.dev/) — Frontend build tool

**Special Thanks:**
- Open source community for excellent tools and libraries
- Contributors and early testers
- Cloud service providers (AWS, Cashfree, Groq)

---

## 📧 Contact & Support

**Project Maintainer:** Suryansh Verma

**Repository:** [github.com/suryanshvermaa/scsCloud](https://github.com/suryanshvermaa/scsCloud)

**Issues:** Report bugs or request features via [GitHub Issues](https://github.com/suryanshvermaa/scsCloud/issues)

**Discussions:** Join conversations in [GitHub Discussions](https://github.com/suryanshvermaa/scsCloud/discussions)

---

## ⭐ Star History

If you find this project helpful, please consider giving it a star on GitHub!

---

<div align="center">

**Built with ❤️ by [Suryansh Verma](https://github.com/suryanshvermaa)**

*Empowering developers with cloud-native tools*

</div>
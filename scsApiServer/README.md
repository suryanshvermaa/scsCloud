# SCS API Server ☁️

**Full-stack cloud platform API** — TypeScript/Express backend powering authentication, payments, S3-compatible object storage, HLS video transcoding, static website hosting, and container deployments via gRPC microservices.

---

## 🎯 What is SCS Cloud?

SCS (Suryansh Cloud Services) is a modern cloud platform offering:
- **🔐 User Authentication** — JWT-based auth with email verification and API key generation
- **💰 Payment Integration** — Cashfree payment gateway with SCS Coins virtual currency
- **📦 Object Storage** — S3-compatible storage powered by per-user MinIO instances on Kubernetes
- **🎬 Video Transcoding** — HLS adaptive bitrate transcoding (360p/480p/720p/1080p) via queue-based workers
- **🌐 Static Website Hosting** — Deploy React/Vite apps with custom subdomains and CDN delivery
- **🚀 Container Deployments** — Deploy Docker containers with custom configs via gRPC service
- **🤖 AI Assistant** — Context-aware documentation chatbot powered by Groq

---

## 🏗️ Architecture

```
┌─────────────────┐
│  Express API    │ ← TypeScript + Express + MongoDB
└────────┬────────┘
         │
    ┌────┴─────────────────────────────────────┐
    │                                           │
┌───▼───────┐  ┌──────────┐  ┌──────────────┐ │
│ BullMQ    │  │ MinIO    │  │ Kubernetes   │ │
│ Queues    │  │ (S3 API) │  │ Jobs/Ingress │ │
└───────────┘  └──────────┘  └──────────────┘ │
    │                                           │
┌───▼───────────────────────────────────────┐  │
│  Worker Processes (separate deployments)  │  │
│  - Transcoding Worker                     │  │
│  - Hosting Worker                         │  │
│  - Email Notifications                    │  │
└───────────────────────────────────────────┘  │
                                               │
┌──────────────────────────────────────────┐  │
│  gRPC ContainerService (external)        │◄─┘
│  - Manage deployments                    │
│  - Kubernetes orchestration              │
└──────────────────────────────────────────┘
```

**Tech Stack:**
- **Backend:** Node.js 22, TypeScript, Express
- **Database:** MongoDB (Mongoose ODM)
- **Storage:** MinIO (S3-compatible), AWS S3
- **Queue:** BullMQ (Redis-backed job queues)
- **Orchestration:** Kubernetes (Jobs, Deployments, Services, Ingress)
- **Payments:** Cashfree Payment Gateway
- **AI/LLM:** Groq (OpenAI GPT OSS 120B)
- **gRPC:** Proto3, @grpc/grpc-js

---

## 📁 Project Structure

```
scsApiServer/
├── src/
│   ├── index.ts                    # Application entry point
│   ├── routes/                     # API route definitions
│   │   ├── user.routes.ts          # Auth, profile, API keys
│   │   ├── payment.routes.ts       # Payment orders and verification
│   │   ├── transcoding.service.routes.ts
│   │   ├── hosting.routes.ts       # Website deployment
│   │   ├── objectStorage.routes.ts # S3-compatible storage ops
│   │   ├── cost.routes.ts          # Pricing information
│   │   ├── deployment.routes.ts    # Container deployments
│   │   └── bot.routes.ts           # AI documentation assistant
│   ├── controllers/                # Request handlers
│   ├── models/                     # MongoDB schemas
│   │   ├── user.model.ts           # User + credentials
│   │   ├── payment.model.ts        # Transaction records
│   │   ├── hosting-website.model.ts
│   │   └── object-storage.model.ts
│   ├── services/                   # External integrations
│   │   ├── queue.service.ts        # 7 BullMQ queues
│   │   ├── k8s.service.ts          # Job scheduling via queues
│   │   ├── s3.service.ts           # AWS S3 signed URLs
│   │   ├── payment.service.ts      # Cashfree SDK
│   │   ├── gRPC/                   # ContainerService client
│   │   ├── k8s/                    # Kubernetes manifests
│   │   │   └── getMinioManifests.ts # Per-user MinIO deployment
│   │   └── objectStorage/
│   │       └── methods.ts          # S3 operations
│   ├── middleware/
│   │   ├── middleware.ts           # JWT auth middleware
│   │   └── error.middleware.ts     # Centralized error handler
│   ├── bot/                        # Documentation chatbot
│   │   ├── index.ts                # Groq integration
│   │   ├── functions.ts            # Tool functions
│   │   ├── sessions.ts             # Conversation state
│   │   └── system_prompt.ts        # LLM instructions
│   ├── utils/
│   │   ├── tokens.ts               # JWT helpers
│   │   ├── response.ts             # Standard response format
│   │   ├── error.ts                # AppError class
│   │   └── asyncHandler.ts         # Error boundary wrapper
│   └── db/
│       └── db.ts                   # MongoDB connection
├── docs/                           # API documentation
│   ├── API.md                      # User & payment endpoints
│   ├── Cost-API.md                 # Pricing endpoints
│   ├── ObjectStorage-API.md        # S3-compatible API docs
│   ├── Transcoding-API.md          # Video transcoding guide
│   └── deployment-API.md           # Container deployment API
├── pb/                             # Generated protobuf types
│   └── containerService/
├── containerService.proto          # gRPC service definition
├── cluster.yaml                    # Kind cluster config (local dev)
├── Dockerfile                      # Multi-stage production build
├── s3.docker-compose.yml           # Local MinIO for testing
├── buildgRPC.sh                    # Protobuf code generator
├── package.json
└── tsconfig.json
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (v22 recommended)
- **MongoDB** 5.0+
- **Redis** 6.0+ (for BullMQ queues)
- **Kubernetes** cluster with `kubectl` configured (optional for local dev)
- **Docker** (for local MinIO and containerized deployment)

### 1️⃣ Clone and Install

```bash
git clone https://github.com/suryanshvermaa/scsCloud.git
cd scsCloud/scsApiServer
npm install
```

### 2️⃣ Environment Setup

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

**Critical variables:**
```env
# Server
PORT=8000
MONGO_URI="mongodb://localhost:27017/scscloud"
IS_UNDER_KUBERNETES="false"  # Set to "true" in production k8s

# JWT Secrets (generate strong random strings)
ACCESS_TOKEN_SECRET="your-secret-here"
REFRESH_TOKEN_SECRET="your-secret-here"
OTP_SECRET="your-secret-here"
ACCESS_KEY_CREDENTIALS_SECRET="your-secret-here"
SECRET_ACCESS_KEY_CREDENTIALS_SECRET="your-secret-here"

# Redis Queue
QUEUE_HOST="localhost"
QUEUE_PORT=6379
QUEUE_USER="default"
QUEUE_PASSWORD="your-redis-password"

# AWS/S3 (for hosting artifacts)
ACCESS_KEY_ID="your-aws-key"
SECRET_ACCESS_KEY="your-aws-secret"
MY_BUCKET_NAME="your-bucket-name"
BUCKET_HOST_FOR_HOSTING="https://s3.amazonaws.com/your-bucket"
HOSTING_DOMAIN="yourdomain.com"

# Pricing (in INR)
TRANSCODER_SERVICE_CHARGE=0.25           # per MB
HOSTING_SERVICE_CHARGE_PER_30_DAYS=80    # per 30 days
STORAGE_PRICE_PER_GB_PER_MONTH_IN_RUPEES=15

# Cashfree Payment Gateway
CASHFREE_APP_KEY="your-cashfree-key"
CASHFREE_APP_SECRET_KEY="your-cashfree-secret"

# gRPC Container Service
CONTAINER_SERVICE_HOST="localhost"
CONTAINER_SERVICE_PORT=4000

# Groq AI
GROQ_API_KEY="your-groq-api-key"
```

### 3️⃣ Start Local Services

**MongoDB:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Redis:**
```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

**MinIO (optional, for local S3 testing):**
```bash
docker compose -f s3.docker-compose.yml up -d
# Access console at http://localhost:9001
# Credentials: l3snnzxhs3 / gmtgl9dlt1e
```

### 4️⃣ Run the API Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

**API will be available at:** `http://localhost:8000`

---

## 🐳 Docker Deployment

### Build Image

```bash
docker build -t scs-api-server:latest .
```

### Run Container

```bash
docker run -d \
  --name scs-api \
  -p 8000:8000 \
  --env-file .env \
  scs-api-server:latest
```

---

## ☸️ Kubernetes Deployment

### Local Development with Kind

Create a local Kubernetes cluster:

```bash
kind create cluster --config cluster.yaml --name scs-cloud
```

This creates a 2-node cluster with port mappings for Ingress (80/443).

### Required Namespaces

```bash
kubectl create namespace scs-cloud   # For jobs and deployments
kubectl create namespace minio       # For per-user MinIO instances
```

### Key Kubernetes Components

**1. Per-User MinIO Instances**
- Each user who enables object storage gets a dedicated MinIO deployment
- Includes: Deployment, Service, PersistentVolume, PersistentVolumeClaim, Secret, Ingress
- Accessible at: `http://minio-{userId}.${HOSTING_DOMAIN}`
- Managed by: `src/services/objectStorage/methods.ts`

**2. Job-Based Workers (Queue-Driven)**
The API server **enqueues jobs** to BullMQ queues instead of directly creating Kubernetes Jobs:

- **Transcoding Worker Queue** (`TranscodingWorker`)
  - Consumes transcoding jobs from Redis
  - Creates Kubernetes Jobs in `scs-cloud` namespace
  - Runs `suryanshvermaaa/transcoding-container:1.0.3`
  - Outputs HLS segments to user's MinIO bucket

- **Hosting Worker Queue** (`HostingWorker`)
  - Consumes hosting jobs from Redis
  - Creates Kubernetes Jobs + Ingress resources
  - Runs `suryanshvermaaa/hosting-container:1.0.0`
  - Deploys static sites from Git repos

**3. Ingress for Hosted Sites**
- Each hosted website gets a unique Ingress with subdomain routing
- Format: `http://{webUrl}.${HOSTING_DOMAIN}`
- Proxies to S3 bucket or static file service

---

## 🔌 gRPC Container Service

The API server communicates with an external **ContainerService** via gRPC for managing container deployments.

**Proto Definition:** `containerService.proto`

```protobuf
service ContainerService {
    rpc GetDeployments(GetDeploymentRequest) returns (GetDeploymentsResponse);
    rpc CreateDeployment(PostDeploymentRequest) returns (PostDeploymentResponse);
    rpc DeleteDeployment(DeleteDeploymentRequest) returns (DeleteDeploymentResponse);
}
```

**Configuration:**
```env
CONTAINER_SERVICE_HOST=containerservice.scs-cloud.svc.cluster.local
CONTAINER_SERVICE_PORT=4000
```

**Generate TypeScript types:**
```bash
npm run proto:gen
# or
./buildgRPC.sh
```

---

## 📬 Queue Architecture

**7 BullMQ Queues** orchestrate background processing:

| Queue Name | Purpose | Consumer |
|------------|---------|----------|
| `Email` | Send verification/notification emails | External worker |
| `APIKEYS` | Send API credentials via email | External worker |
| `Hosting` | Notify users of successful hosting | External worker |
| `HostingRenewal` | Notify hosting renewals | External worker |
| `PaymentQueue` | Payment confirmation emails | External worker |
| **`TranscodingWorker`** | **Process video transcoding jobs** | **Transcoding worker** |
| **`HostingWorker`** | **Deploy static websites** | **Hosting worker** |

**Queue Configuration:**
```typescript
// src/services/queue.service.ts
export const transcodingWorkerQueue = new Queue('TranscodingWorker', {
  connection: {
    host: process.env.QUEUE_HOST,
    port: Number(process.env.QUEUE_PORT),
    username: process.env.QUEUE_USER,
    password: process.env.QUEUE_PASSWORD
  }
});
```

**Job Flow:**
```
API Request → Controller → scheduleTranscodingJob()
                              ↓
                    transcodingWorkerQueue.add()
                              ↓
                    [Redis Queue Storage]
                              ↓
              Transcoding Worker (separate process)
                              ↓
              Creates Kubernetes Job → Executes → Notifies User
```

---

## 🛠️ API Endpoints

### Base Routes

| Mount Point | Domain | Description |
|-------------|--------|-------------|
| `/api/v1` | User, Transcoding, Cost, Object Storage, Deployment | Core APIs |
| `/api/payment` | Payments | Cashfree integration |
| `/api/host` | Hosting | Static website deployment |
| `/api/v1/bot` | AI Assistant | Documentation chatbot |

### Health Check

```http
GET /api/v1/health-check
```

**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "data": {
    "timestamp": "2025-11-14T10:30:00.000Z"
  }
}
```

### Complete Documentation

- **📘 User & Payment API** → [`docs/API.md`](docs/API.md)
- **💰 Cost API** → [`docs/Cost-API.md`](docs/Cost-API.md)
- **📦 Object Storage API** → [`docs/ObjectStorage-API.md`](docs/ObjectStorage-API.md)
- **🎬 Transcoding API** → [`docs/Transcoding-API.md`](docs/Transcoding-API.md)
- **🚀 Deployment API** → [`docs/deployment-API.md`](docs/deployment-API.md)

---

## 🌐 Subdomain Proxy for Hosted Sites

The API server includes a **smart proxy middleware** that routes non-API subdomains to hosted static websites:

```typescript
// src/index.ts
app.get('/*', (req, res, next) => {
  const subdomain = req.hostname.split('.')[0];
  
  if (subdomain !== 'api' && subdomain !== 'www' && subdomain !== 'localhost') {
    // Proxy to S3: https://s3.amazonaws.com/bucket/subdomain/
    const resolveWeb = `${process.env.BUCKET_HOST_FOR_HOSTING}/${subdomain}`;
    const proxy = httpProxy.createProxy();
    proxy.web(req, res, { target: resolveWeb, changeOrigin: true });
    
    // Serve index.html for root path
    proxy.on('proxyReq', (proxyReq, req) => {
      if (req.url === '/') proxyReq.path += 'index.html';
    });
    return;
  }
  
  next(); // Pass to Express routes
});
```

**Example:**
- `http://api.yourdomain.com/api/v1/profile` → API server
- `http://myapp.yourdomain.com/` → S3 bucket at `/myapp/index.html`

---

## 🤖 AI Documentation Assistant

Built-in chatbot using **Groq (OpenAI GPT OSS 120B)** with function calling for context-aware documentation assistance.

**Endpoint:**
```http
POST /api/v1/bot/chat
Content-Type: application/json

{
  "message": "How do I configure my Vite app for hosting?",
  "sessionId": "user-session-123",
  "AccessCookie": "optional-jwt-token"
}
```

**Features:**
- Session-based conversation memory (15-minute timeout)
- Function calling for structured docs retrieval
- Topics: Static Hosting, HLS Transcoding, Object Storage
- Automatic code snippet generation

**Available Tools:**
- `getStaticHostingSteps()` - Deployment guide
- `getViteConfigSnippet()` - Vite configuration
- `getHlsTranscodingExample()` - Video transcoding code
- `getObjectStorageApiSetupNodejs()` - S3 client setup

---

## 💾 Data Models

### User Model
```typescript
{
  name: string,
  email: string,
  password: string (hashed),
  SCSCoins: number,              // Virtual currency balance
  accessKey: string,              // Programmatic API key
  secretAccessKey: string,        // Programmatic secret
  credentialsActive: boolean,
  objectStorageServiceEnabled: boolean,
  refreshToken: string,
  paymentCount: number,
  paymentAmount: number,
  isAdmin: boolean
}
```

### ObjectStorage Model
```typescript
{
  userId: ObjectId,
  accessKey: string,              // MinIO access key
  secretAccessKey: string,        // MinIO secret
  storageInGB: number,
  storageEndpoint: string,        // MinIO service URL
  service: string,                // K8s service name
  ingressEndpoint: string,        // Public URL
  expiryDate: Date                // Subscription expiry
}
```

### Website (Hosting) Model
```typescript
{
  websiteName: string,
  websiteType: string,            // 'react', 'vite', 'static'
  websiteUrl: string,             // Public URL
  s3bucketUrl: string,            // Internal S3 path
  validDate: Date,                // Hosting expiry
  user: ObjectId
}
```

### Payment Model
```typescript
{
  paymentId: string,              // Cashfree payment ID
  orderId: string,                // Cashfree order ID
  amount: number,
  payment_currency: string,
  userId: ObjectId
}
```

---

## 🔐 Authentication

**Two authentication methods supported:**

### 1. JWT Access Tokens (User Sessions)
```http
POST /api/v1/login
{
  "email": "user@example.com",
  "password": "password123"
}

→ Returns: AccessCookie (1h), RefreshCookie (12h)
```

**Usage:**
```http
GET /api/v1/profile
Cookie: AccessCookie=eyJhbGci...

# Or in request body:
{ "AccessCookie": "eyJhbGci..." }
```

### 2. API Credentials (Programmatic Access)
```http
POST /api/v1/create-api-keys
Cookie: AccessCookie=...

→ Email sent with accessKey + secretAccessKey
```

**Usage:**
```http
POST /api/v1/upload-video
{
  "credentials": {
    "accessKey": "jwt-signed-key",
    "secretAccessKey": "jwt-signed-secret"
  },
  "fileName": "video.mp4",
  ...
}
```

---

## 💰 Pricing & SCS Coins

Users purchase **SCS Coins** (virtual currency) via Cashfree payments:

| Service | Cost | Unit |
|---------|------|------|
| **Video Transcoding** | ₹0.25 | per MB of input video |
| **Static Hosting** | ₹80 | per 30 days |
| **Object Storage** | ₹15 | per GB per 30 days |

**Get current pricing:**
```http
GET /api/v1/cost/details
```

**Recharge flow:**
```
1. POST /api/payment/create-order → Cashfree order
2. User completes payment on Cashfree gateway
3. POST /api/payment/verify-payment → Credits SCS Coins
```

---

## 🧪 Development Scripts

```bash
# Development with hot reload
npm run dev

# Build TypeScript to dist/
npm run build

# Run production build
npm start

# Generate protobuf TypeScript types
npm run proto:gen
./buildgRPC.sh  # Alternative script
```

---

## 🧩 Extending the Platform

### Adding a New Service

1. **Create route file**: `src/routes/myservice.routes.ts`
2. **Create controller**: `src/controllers/myservice.controller.ts`
3. **Add to index.ts**:
   ```typescript
   import myServiceRouter from './routes/myservice.routes';
   app.use('/api/v1/myservice', myServiceRouter);
   ```
4. **Document in**: `docs/MyService-API.md`

### Adding a New Queue

```typescript
// src/services/queue.service.ts
export const myNewQueue = new Queue('MyNewQueue', connection);
```

### Creating Worker Processes

Workers should be separate Node.js processes that:
1. Connect to BullMQ queue
2. Process jobs
3. Interact with Kubernetes/external services
4. Send notifications

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB connection fails:**
```bash
# Check MongoDB is running
docker ps | grep mongodb

# Test connection
mongosh mongodb://localhost:27017/scscloud
```

**Redis queue errors:**
```bash
# Verify Redis is accessible
redis-cli -h localhost -p 6379 ping

# Check queue connection in logs
npm run dev | grep "Queue"
```

**Kubernetes Jobs not creating:**
```bash
# Verify kubeconfig
kubectl config current-context

# Check namespaces
kubectl get namespaces

# View queue contents (requires Redis CLI)
redis-cli -h localhost -p 6379
> KEYS bull:TranscodingWorker:*
```

**MinIO deployment fails:**
```bash
# Check PersistentVolume
kubectl get pv -n minio

# Check pod status
kubectl get pods -n minio

# View logs
kubectl logs -n minio deployment/minio-deployment-{userId}
```

---

## 📊 Monitoring & Observability

**Recommended setup:**
- **BullMQ UI**: [bull-board](https://github.com/felixmosh/bull-board) for queue monitoring
- **Prometheus**: Kubernetes metrics collection
- **Grafana**: Dashboard for API metrics
- **MongoDB Compass**: Database monitoring
- **Redis Commander**: Queue inspection

---

## 🚧 Roadmap & Contributing

### Planned Features
- [ ] Multi-region storage replication
- [ ] CDN integration for hosted sites
- [ ] Custom domain support (CNAME)
- [ ] Kubernetes autoscaling for workers
- [ ] Real-time transcoding progress (WebSocket)
- [ ] Usage analytics dashboard
- [ ] API rate limiting and quotas
- [ ] Stripe payment integration

### Contributing Guidelines
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

**Code Style:**
- Follow existing TypeScript conventions
- Add JSDoc comments for public APIs
- Write descriptive commit messages
- Update relevant documentation

---

## 📄 License

**ISC License**

Copyright © 2025 Suryansh Verma

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

---

## 🤝 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/suryanshvermaa/scsCloud/issues)
- **Discussions**: [GitHub Discussions](https://github.com/suryanshvermaa/scsCloud/discussions)
- **Email**: support@scscloud.io

---

## 🌟 Acknowledgments

Built with:
- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [BullMQ](https://docs.bullmq.io/)
- [Kubernetes Client (Node.js)](https://github.com/kubernetes-client/javascript)
- [MinIO](https://min.io/)
- [Cashfree](https://www.cashfree.com/)
- [Groq](https://groq.com/)

---

**Made with ❤️ by Suryansh Verma**

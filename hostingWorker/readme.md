# Hosting Worker 🚀

The **Hosting Worker** listens to the `HostingWorker` BullMQ queue and, for each job received, schedules a Kubernetes `Job` and creates an `Ingress` to publicly expose the deployed web application. It stitches together source code (via a Git URL) and a target web hostname (via `webUrl`) while injecting object storage credentials so the hosted artifacts can be fetched or persisted.

---
## Table of Contents 📚
1. [Features](#features-)
2. [Architecture](#architecture-)
3. [Folder Structure](#folder-structure-)
4. [Environment Variables](#environment-variables-)
5. [Local Development](#local-development-)
6. [Docker Usage](#docker-usage-)
7. [Kubernetes Deployment](#kubernetes-deployment-)
8. [Queue Integration](#queue-integration-)
9. [Example Job Payload](#example-job-payload-)
10. [Troubleshooting](#troubleshooting-)
11. [Roadmap](#roadmap-)
12. [License](#license-)

---
## Features ✨
* 🧵 Consumes BullMQ jobs from a Redis-backed queue (`HostingWorker`).
* ☸️ Dynamically generates and submits Kubernetes `Job` manifests using `@kubernetes/client-node`.
* 🌐 Automatically provisions a Kubernetes `Ingress` per hosted app.
* 🔐 Injects storage + repository information via environment variables (bucket + access keys + git URL + target web URL).
* 🛡 Configurable retry / backoff (K8s `backoffLimit: 2`).
* 🧩 Clean separation of concerns (`manifests.ts` for resource creation, `schedule.ts` for orchestration, `index.ts` for queue worker bootstrap).

---
## Architecture 🧱
```text
BullMQ Queue (Redis) ──▶ Worker (index.ts) ──▶ scheduleHostingJob()
																				 │
																				 ├─▶ Create K8s Job (hosting pod runs container image)
																				 └─▶ Create K8s Ingress (exposes web app on HOSTING_DOMAIN)
```

### Flow 🔄
1. A producer enqueues a job on the `HostingWorker` queue; the job `data` contains a JSON blob with `runProps`.
2. `index.ts` parses the job and calls `scheduleHostingJob(runProps)`.
3. `scheduleHostingJob`:
	 * Builds a `V1Job` manifest via `hostingJob(runProps)`.
	 * Submits the `Job` to namespace `scs-cloud` using `BatchV1Api`.
	 * Creates an `Ingress` targeting service `scs-cloud-app-service:3000`, with host derived from `webUrl` and `HOSTING_DOMAIN`.
4. Kubernetes runs the container image `suryanshvermaaa/hosting-container:1.0.0` with environment variables for storage + repo + site config.

---
## Folder Structure 📁
```
hostingWorker/
├─ Dockerfile              # Multi-stage build: compile TS then run minimal runtime
├─ docker-compose.yml      # Local example (app + Mongo; adjust if Redis needed for BullMQ)
├─ package.json            # Scripts & dependencies
├─ tsconfig.json           # TypeScript compiler configuration
├─ eslint.config.mjs       # ESLint + Prettier integration
├─ .env.example            # Sample environment configuration
├─ src/
│  ├─ index.ts             # Queue worker entrypoint
│  ├─ schedule.ts          # Orchestrates job + ingress creation
│  ├─ manifests.ts         # Functions returning K8s Job & Ingress manifests
│  └─ config/k8s.ts        # KubeConfig loader & API clients
└─ readme.md               # This file
```

---
## Environment Variables 🔐
Defined in `.env.example` (must be supplied at runtime):

| Variable | Purpose |
|----------|---------|
| `QUEUE_HOST` | Redis host for BullMQ |
| `QUEUE_PORT` | Redis port |
| `QUEUE_USER` | Redis username (if ACL/auth enabled) |
| `QUEUE_PASSWORD` | Redis password |
| `BUCKET_NAME` | Object storage bucket name |
| `ACCESS_KEY_ID` | Object storage access key ID |
| `SECRET_ACCESS_KEY` | Object storage secret access key |
| `HOSTING_DOMAIN` | Base domain for generated ingress hosts (e.g. `apps.example.com:80`) |

Job-specific `runProps` (in queue payload):
| Field | Meaning |
|-------|---------|
| `gitUrl` | Repository URL to be processed inside hosting container |
| `webUrl` | Desired subdomain identifier used in Ingress host & naming |

⚠️ Security Tip: Never commit real access keys. Use Kubernetes secrets or external secret managers in production.

---
## Local Development 🛠️
### Prerequisites
* Node.js 20+ (Dockerfile uses Node 23 alpine, but dev can be 20+ per `@tsconfig/node20`).
* Redis 7+ (BullMQ backend) – not currently in `docker-compose.yml`, add if needed.
* Kubernetes access (for actual job + ingress creation). For local simulation you can skip running schedule calls or use a mock.

### Install
```bash
npm install
```

### Run in watch mode
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Lint & Format
```bash
npm run lint
npm run format
```

### Start (after build)
```bash
npm start
```

---
## Docker Usage 🐳
Multi-stage build produces a lean runtime image:
```bash
docker build -t hosting-worker:local .
docker run --env-file .env hosting-worker:local
```

`docker-compose.yml` currently provisions Mongo; BullMQ requires Redis, so either:
1. Add a Redis service to `docker-compose.yml`.
2. Point env vars to an existing Redis instance.

Example addition:
```yaml
	redis:
		image: redis:7-alpine
		ports: ["6379:6379"]
```

Then set `QUEUE_HOST=redis` and `QUEUE_PORT=6379`.

---
## Kubernetes Deployment ☸️
The worker itself can run as a long-lived pod/Deployment that watches the queue:
1. Create a Docker image from this repo and push to a registry.
2. Define a Deployment referencing the image and mounting secrets for ENV.
3. Ensure the cluster has access to Redis (internal service or external).
4. Grant RBAC permissions to create Jobs & Ingress (ClusterRole + RoleBinding if needed).

RBAC Example (conceptual):
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata: { name: hosting-worker }
rules:
	- apiGroups: ["batch"]
		resources: ["jobs"]
		verbs: ["create","get","list"]
	- apiGroups: ["networking.k8s.io"]
		resources: ["ingresses"]
		verbs: ["create","get","list"]
```

---
## Queue Integration 📬
BullMQ jobs are consumed via:
```ts
new Worker('HostingWorker', async job => { /* ... */ }, connectionConfig)
```
Connection config uses Redis credentials from environment variables.

### Adding a Job (Producer Example)
```ts
import { Queue } from "bullmq";
const queue = new Queue("HostingWorker", { connection: { host: "localhost", port: 6379 }});
await queue.add("host-app", JSON.stringify({ runProps: { gitUrl: "https://github.com/user/project.git", webUrl: "myapp" }}));
```

---
## Example Job Payload 📨
Raw job `data` (stringified) should contain:
```json
{
	"runProps": {
		"gitUrl": "https://github.com/user/project.git",
		"webUrl": "myapp"
	}
}
```
Resulting ingress host (if `HOSTING_DOMAIN=apps.example.com:80`):
```
myapp.apps.example.com
```

---
## Troubleshooting 🩺
| Symptom | Possible Cause | Fix |
|---------|----------------|-----|
| Worker exits on start | Missing Redis env vars | Check `.env` and ensure Redis reachable |
| Jobs stay pending | Redis auth / connection failure | Verify `QUEUE_*` values and ACL permissions |
| Ingress not created | RBAC denied | Grant appropriate cluster role / binding |
| 404 when accessing host | Service name mismatch | Confirm service `scs-cloud-app-service` exists in `scs-cloud` namespace |
| Job pod CrashLoopBackOff | Bad image tag or missing env secrets | Validate container image + env values |

### Logging Tips
* Add temporary `console.log` inside `scheduleHostingJob` for manifests.
* Use `kubectl describe job <name>` and `kubectl logs pod/<pod>` for runtime debugging.

---
## Roadmap 🗺️
* ✅ Basic Job + Ingress provisioning
* ⏳ Add validation & schema for job payload
* ⏳ Switch to Kubernetes Secrets for access keys
* ⏳ Add metrics (Prometheus) for job success/failure
* ⏳ Automated retries / DLQ for failed scheduling

---
## License 📄
Refer to repository root `LICENSE` file for full terms.

---
## Quick Start TL;DR ⚡
```bash
cp .env.example .env            # Fill in required values
npm install                     # Install deps
npm run build                   # Compile TypeScript
npm start                       # Start worker (needs Redis + K8s access)
```

Enjoy deploying apps dynamically! 🌈


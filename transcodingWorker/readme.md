# 🎬 Transcoding Worker

> A lightweight Node.js + TypeScript BullMQ worker that schedules ephemeral Kubernetes Jobs to transcode user videos and push results back to object storage. Designed for a cloud-native, queue‑driven media pipeline. 🚀

## ✨ What It Does

1. 🧾 Listens on the `TranscodingWorker` BullMQ queue (Redis-backed).
2. 📦 Parses each job payload to extract `runProps` (video + user + storage context).
3. 🏗 Dynamically builds a Kubernetes `Job` manifest (`batch/v1`) with environment vars.
4. 🎞 Launches a one‑off transcoding container (`suryanshvermaaa/transcoding-container:1.0.3`).
5. 📤 Container pulls source video, transcodes, and stores outputs in the user’s bucket path.
6. 📧 (Future‑friendly) Can emit completion events / email notifications.

## 🧱 Architecture Overview

```
┌─────────────┐        enqueue         ┌────────────────┐  create Job  ┌────────────────────────┐
│ API / Event │  ───────────────────▶  │ Redis (BullMQ) │ ───────────▶ │ TranscodingWorker (TS) │
└─────────────┘                        └────────────────┘              └─────────┬──────────────┘
																																			k8s BatchV1 API
																																							 │
																																							 ▼
																																		 ┌────────────────┐
																																		 │ K8s Job Pod    │
																																		 │ (Transcoding)  │
																																		 └───────┬────────┘
																																						 │
																															Artifacts / Logs / Notifications
																																						 │
																																						 ▼
																																	 Object Storage / Queue
```

### Key Components
- `src/index.ts` ➜ BullMQ Worker bootstrap.
- `src/schedule.ts` ➜ Schedules a Kubernetes Job in namespace `scs-cloud`.
- `src/manifests.ts` ➜ Builds the `V1Job` spec (dynamic env injection).
- `src/config/k8s.ts` ➜ Loads kubeconfig & creates Batch API client.
- `Dockerfile` ➜ Multi‑stage build (builder ➜ runtime) with prod dependency pruning.
- `.env.example` ➜ Declares required runtime variables.

## 🔑 Job Payload Schema

Each queue job must contain a JSON string with shape:

```json
{
	"runProps": {
		"videoKey": "source/path/video.mp4",
		"userAccessKey": "<access_key>",
		"userSecretAccessKey": "<secret_key>",
		"userBucketName": "my-media-bucket",
		"bucketPath": "outputs/user123/",
		"email": "user@example.com",
		"storageEndpoint": "https://storage.endpoint"
	}
}
```

These map to environment variables injected into the Kubernetes Job spec (`manifests.ts`).

## 🌱 Environment Variables

Define these in `.env` (never commit secrets):

| Variable | Purpose |
|----------|---------|
| `QUEUE_HOST` | Redis host for BullMQ |
| `QUEUE_PORT` | Redis port |
| `QUEUE_USER` | Redis ACL user (if used) |
| `QUEUE_PASSWORD` | Redis password / token |
| `BUCKET_NAME` | Default bucket (may be overridden by job) |
| `ACCESS_KEY_ID` | Access/identity key for storage (example) |
| `SECRET_ACCESS_KEY` | Secret/credential key for storage |

Additional per‑job runtime values (video path, email, etc.) are passed inside `runProps`.

## 🛠 Local Development

```bash
# 1. Install deps
npm install

# 2. Provide .env (copy template)
cp .env.example .env && edit .env

# 3. Compile TypeScript
npm run build

# 4. Start worker (compiled JS)
npm start

# OR run in dev (watch mode)
npm run dev
```

Make sure Redis is reachable (Docker, local install, or cloud). Example quick start:

```bash
docker run -p 6379:6379 redis:7-alpine
```

## 🐳 Container Image Workflow

Multi‑stage Dockerfile:
1. Builder installs all deps & compiles TS → `dist/`.
2. Runner copies `dist` + `package.json` and installs production deps only.
3. Entrypoint: `npm start` ➜ runs `node dist/index.js`.

Build & run locally:
```bash
docker build -t transcoding-worker:local .
docker run --env-file .env --network host transcoding-worker:local
```

## ☸️ Kubernetes Integration

- Uses your default kubeconfig (`kc.loadFromDefault()`).
- Creates Jobs in namespace: `scs-cloud`.
- Each Job gets a unique name prefix: `transcoding-job-<timestamp>`.
- Container image: `suryanshvermaaa/transcoding-container:1.0.3` (custom transcoder logic lives there).
- Restart policy: `Never`; `backoffLimit: 1` for quick fail surface.

### RBAC / Permissions
Ensure the kubeconfig context has permissions: `batch.jobs.create` in `scs-cloud` namespace.

## 📥 Enqueuing a Job (Example)

```js
import { Queue } from 'bullmq';
const queue = new Queue('TranscodingWorker', { connection: { host: '127.0.0.1', port: 6379 } });

await queue.add('transcode', {
	runProps: {
		videoKey: 'uploads/raw/video123.mp4',
		userAccessKey: 'AKIA...'
		userSecretAccessKey: '****',
		userBucketName: 'media-user123',
		bucketPath: 'processed/user123/',
		email: 'user123@example.com',
		storageEndpoint: 'https://s3.compat.example'
	}
});
```

## 🧪 Testing Ideas (Not Included Yet)
- Mock BullMQ and assert Job creation call count.
- Manifest snapshot test (ensure env injection correctness).
- Integration: enqueue ➜ observe k8s Job status.

## ⚠️ Edge Cases / Notes
- Missing or malformed `runProps` ➜ Consider validation (future improvement).
- Redis downtime ➜ Worker will error; consider retry / backoff strategy.
- K8s API latency or failure ➜ Add logging + exponential retry wrapper (currently single attempt).
- Secrets exposure ➜ Keep sensitive values in environment / external secret store.

## 🚀 Extending
- Add result notification (email/webhook) after Job completion.
- Include transcoding presets in job payload (resolution, bitrate, codec).
- Add metrics export (Prometheus) for job count & failures.

## 🧹 Lint & Format
```bash
npm run lint
npm run lint:fix
npm run format
```

## 🩺 Health & Troubleshooting
| Symptom | Check | Fix |
|---------|-------|-----|
| Worker silent | Is queue name correct? | Use `TranscodingWorker` exactly |
| Jobs stuck | Redis connection OK? | Verify `.env` host/port/auth |
| No k8s Job | Kubeconfig context perms? | Grant `create jobs` RBAC |
| Env missing in Pod | Manifest build changed? | Inspect `manifests.ts` / describe Job |

## 📄 License
Uses the parent repository license (see root `LICENSE`).

## ❤️ Contributing
PRs for validation, observability, and post‑processing welcome. Open an issue with enhancement ideas.

---
Made with TypeScript, BullMQ, and Kubernetes. 🌐🎥


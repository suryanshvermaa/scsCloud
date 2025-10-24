# scsApiServer

Lightweight TypeScript Express API for SCS Cloud services — user auth, payment integration, video transcoding orchestration and static website hosting orchestration.

## What this repo contains
- Express + TypeScript API server
- MongoDB models for users, payments and hosted websites
- Routes and controllers for: user auth, payment flows, HLS transcoding orchestration and website hosting
- Integrations: AWS S3 (signed URLs), AWS ECS (Fargate tasks), Cashfree payment gateway, BullMQ for background queues

## Tech stack
- Node.js + TypeScript
- Express
- MongoDB (mongoose)
- AWS SDK (S3, ECS)
- BullMQ (Redis-backed queues)
- Cashfree payment SDK

## Quick start (Windows PowerShell)
1. Copy `.env.example` to `.env` and fill values.

2. Install dependencies:

```powershell
npm install
```

3. Run in development (uses `ts-node` / `nodemon`):

```powershell
npm run dev
```

4. Build and run production:

```powershell
npm run build
npm start
```

Notes:
- This project expects external services (MongoDB, a message queue compatible with BullMQ, AWS credentials and ECS setup, Cashfree credentials). Use the `.env.example` as a template.

## Environment variables
All variables are listed in `.env.example`. Important ones:
- `MONGO_URI` - MongoDB connection string
- `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `OTP_SECRET` - JWT secrets
- `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY`, `MY_BUCKET_NAME` - AWS credentials and S3 bucket
- `CLUSTER_ARN`, `TRANSCODER_TASK_DEFINITION_ARN`, `HOSTER_TASK_DEFINITION_ARN`, `TRANSCODER_TASK_NAME`, `HOSTER_TASK_NAME`, `MY_SUBNET_*`, `MY_SECURITY_GROUP` - ECS/Fargate config
- `QUEUE_HOST`, `QUEUE_USER`, `QUEUE_PASSWORD` - BullMQ/Redis connection
- `CASHFREE_APP_KEY`, `CASHFREE_APP_SECRET_KEY` - Cashfree gateway
- `TRANSCODER_SERVICE_CHARGE`, `HOSTING_SERVICE_CHARGE_PER_30_DAYS` - service charge config

## Project layout
- `src/index.ts` - server entry (also contains a proxy that forwards non-`api` subdomains to S3 hosted websites)
- `src/routes` - route definitions
- `src/controllers` - controllers implementing route logic
- `src/models` - Mongoose models
- `src/services` - integrations (S3 signed URLs, ECS task runner, payment SDK, queues)
- `src/utils` - helper utilities (token helpers, etc.)

## API documentation
See `docs/API.md` for full list of routes, parameters and example responses.

## Notes and assumptions
- This documentation intentionally excludes secrets and `node_modules` per project policy.
- The server expects a properly configured ECS cluster and task definitions for transcoding and hosting.

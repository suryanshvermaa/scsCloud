# 📧 SCS Cloud — Email Worker

Lightweight Node.js email worker that processes queued email jobs (BullMQ) and sends notification emails using Nodemailer. This repository contains workers that listen to multiple queues and send different transactional emails (OTP, hosting, hosting renewal, API keys, payment receipts, and transcoding notifications).

## 🎯 What this does

- ⚡ Runs BullMQ workers that listen to Redis (configured via environment variables) for job messages.
- 📦 Deserializes job payloads and delegates to mailer functions in `src/mails/*`.
- ✉️ Uses Nodemailer (Gmail SMTP in current implementation) to send formatted HTML emails.

## 📁 Files

- 🐳 `Dockerfile` — small Node 18 Alpine image that installs dependencies and runs the worker.
- 📦 `package.json` — project metadata and scripts. Notable deps: `bullmq`, `dotenv`, `nodemailer`.
- ⚙️ `src/index.js` — registers BullMQ `Worker`s for the following queues:
  - 🔐 `Email` — verification OTP emails (uses `src/mails/otp.mail.js`).
  - 🎬 `TranscodingQueue` — transcoding-complete emails (uses `src/mails/transcoding.mail.js`).
  - 🔑 `APIKEYS` — API key delivery (uses `src/mails/apiKeys.mail.js`).
  - 🚀 `Hosting` — hosting deployment success (uses `src/mails/hosting.mail.js`).
  - ✅ `HostingRenewal` — hosting renewal confirmation (uses `src/mails/hostingRenewal.mail.js`).
  - 💳 `PaymentQueue` — payment receipts (uses `src/mails/payment.mail.js`).
- 📧 `src/mails/*.mail.js` — each file exports an async function that builds an HTML email and sends it via Nodemailer. These templates include styled HTML and accept parameters (e.g., `otp`, `videoKey`, `accessKey`, `secretAccessKey`, `websiteUrl`, `amount`, `paymentId`).

## 📋 Requirements

- 🟢 Node.js 18+ (Dockerfile uses `node:18-alpine`).
- 🔴 Redis instance for BullMQ (host/port/username/password configured via env).
- 📮 A Gmail account configured for Nodemailer (or replace transporter settings with your SMTP provider).

## 🔐 Environment variables

Create a `.env` file at the project root (or provide env via your deployment). The code expects the following variables:

- 🔴 `QUEUE_HOST` — Redis host
- 🔌 `QUEUE_PORT` — Redis port (number)
- 👤 `QUEUE_USER` — Redis username (if used)
- 🔑 `QUEUE_PASSWORD` — Redis password
- 📧 `MY_EMAIL` — Gmail email used by Nodemailer (sender)
- 🔒 `MY_PASSWORD` — Gmail app password (recommended) or account password

**📝 Notes:**
- ⚠️ For Gmail, it's best to use an App Password (if using 2FA) or a proper SMTP account; avoid using your personal password.
- 🚀 Consider switching to a more robust transport (SendGrid, Mailgun, SES) for production and rate-limiting/queue control.

## 💻 Install & Run (local)

1. Install dependencies:

```bash
npm install
```

2. Create `.env` with the variables listed above.

3. Start the worker:

```bash
npm start
# or for development with auto-reload
npm run dev
```

The workers subscribe to the configured queues and will process jobs as they arrive.

## 🐳 Build & Run with Docker

1. Build the image from repository root:

```bash
docker build -t scscloud-email-worker .
```

2. Run the container (example, pass env variables):

```bash
docker run -e QUEUE_HOST=redis.example -e QUEUE_PORT=6379 \
  -e QUEUE_USER=default -e QUEUE_PASSWORD=your_redis_password \
  -e MY_EMAIL=you@example.com -e MY_PASSWORD=app_password \
  scscloud-email-worker
```

Adjust the env vars to point to your Redis and SMTP credentials.

## ⚙️ How it works (short)

- 🔧 `src/index.js` creates multiple `Worker` instances (one per queue) using BullMQ. Each worker's processor expects `job.data` to be a JSON string and parses it.
- 📤 After parsing, the worker calls the appropriate mailer function from `src/mails/*.mail.js`.
- 📨 Mailer functions create a Nodemailer transporter (Gmail SMTP in code) and call `transporter.sendMail()` with HTML templates.

## 📬 Template summary

- 🔐 `otp.mail.js` — sends verification codes (OTP). Expects `{ email, otp }`.
- 🎬 `transcoding.mail.js` — sends video transcoding completion notifications. Expects `{ email, videoKey }`.
- 🔑 `apiKeys.mail.js` — emails generated accessKey and secretAccessKey. Expects `{ email, accessKey, secretAccessKey }`.
- 🚀 `hosting.mail.js` — informs user of successful website deployment. Expects `{ email, websiteUrl }`.
- ✅ `hostingRenewal.mail.js` — confirms hosting renewal. Expects `{ email, websiteUrl }`.
- 💳 `payment.mail.js` — payment receipt and information. Expects `{ email, amount, paymentId }`.

Each template sends a polished HTML email including branding and helpful metadata. They currently hardcode `from: 'suryanshverma.nitp@gmail.com'`—you may want to replace this with a configurable `FROM_EMAIL` env variable.

## 🔒 Security & production notes

- ⚠️ Do not commit `.env` or credentials to source control.
- 📮 Prefer sending emails through a transactional email provider for higher deliverability and monitoring.
- 🔄 Consider pooling Nodemailer transport connections to avoid creating a new transporter per email in high throughput scenarios.
- 🔁 Add retries/backoff for failed jobs and monitoring/alerting on the queues.

## 🚀 Next steps / Improvements

- ♻️ Move transporter creation out of each function and reuse a shared, pooled transport.
- 🧪 Add unit tests for template rendering and integration tests against a local SMTP server (e.g., MailHog) and a test Redis instance.
- 📊 Add structured logging, metrics (job durations, failures), and health checks.

## 📞 Contact

If this is part of SCS Cloud internal tooling, reach out to the maintainers or open an issue in the repo with details.

---
Generated by project inspection on 2025-11-14.

## API Reference 📚

Base URL: /api

All endpoints below are relative to the server base (for example: `http://{host}/api/v1/register`). Some routes use `/api/v1` and others use `/api/payment` or `/api/host` per router mounting in `src/index.ts`.

Authentication 🔐
- Two auth flows are supported in controllers:
  - User JWT access/refresh cookies (AccessCookie, RefreshCookie) which are JWTs generated with `ACCESS_TOKEN_SECRET` / `REFRESH_TOKEN_SECRET`.
  - API credentials (accessKey + secretAccessKey) signed using secrets `ACCESS_KEY_CREDENTIALS_SECRET` and `SECRET_ACCESS_KEY_CREDENTIALS_SECRET` for programmatic access.

Summary of routes 🧭

1) User routes 👤 (mounted at `/api/v1`)

- ➕ POST `/api/v1/register`
  - Body: { email, password, name }
  - Action: Generates OTP, stores verification data in a JWT cookie `authCookie`, enqueues email job.
  - Response 201: { success: true, message: 'Please Check your otp for verification', cookie: { key: 'authCookie', value } }

- ➕ POST `/api/v1/verify-email`
  - Body: { OTP } (or cookie `authCookie` will be read automatically)
  - Action: Verifies OTP, creates user in DB, clears `authCookie`.
  - Response 201: { success: true, message: 'user created successfully. you can login to your account', data }

- ➕ POST `/api/v1/login`
  - Body: { email, password }
  - Action: Checks credentials, returns cookies `AccessCookie` (1h) and `RefreshCookie` (12h).
  - Response 200: { success: true, message: 'login successfully', cookies: [ {key: 'AccessCookie', value}, {key: 'RefreshCookie', value} ] }

- ➕ POST `/api/v1/logout`
  - Action: Clears `AccessCookie` and `RefreshCookie` cookies.
  - Response 200: { success: true, message: 'logout successfully' }

- 🔎 GET `/api/v1/refresh-token`
  - Action: Uses `RefreshCookie` to generate new `AccessCookie` and `RefreshCookie` and updates user record.
  - Response 200: { success: true, message: 'Access token refressment successfully', cookies: [...] }

- 🔎 GET `/api/v1/profile`
  - Auth: send `AccessCookie` (cookie or in body/query as `AccessCookie`/`token`)
  - Action: Returns user profile (excludes refreshToken, isAdmin, _id)
  - Response 200: { success: true, message: 'user profile fetched successfully', data }

- 🔎 GET `/api/v1/health-check`
  - Action: Simple health check
  - Response 200: { success: true, message: 'API is healthy', data: { timestamp } }

- 🔎 GET `/api/v1/scs-coins`
  - Auth: `AccessCookie`
  - Action: Returns current SCS coins balance for the user
  - Response 200: { success: true, message: 'user profile fetched successfully', data: { scsCoins } }

- ➕ POST `/api/v1/create-api-keys`
  - Auth: `AccessCookie`
  - Action: Creates programmatic credentials for the user (stores accessKey and secretAccessKey in user doc), enqueues email to user with the keys.
  - Response 201: { success: true, message: 'api keys created' }

- 🔎 GET `/api/v1/get-access-key`
  - Auth: `AccessCookie`
  - Action: Returns user's accessKey
  - Response 201: { success: true, data: { accessKey } }

2) Transcoding routes 🎬 (mounted at `/api/v1`)

- ➕ POST `/api/v1/upload-video`
  - Auth: either `AccessCookie` or programmatic `credentials` object in body: { accessKey, secretAccessKey }
  - Body (user auth): { fileName, AccessCookie }
  - Body (programmatic): { fileName, credentials: { accessKey, secretAccessKey } }
  - Action: If authorized and user has enough SCSCoins, returns a signed S3 PUT URL for `outputs/{fileName}` so the user can upload source file.
  - Response 200 (success): { success: true, message: 'uploading video', uploadUrl, videoKey, email? }

- ➕ POST `/api/v1/transcoding-video`
  - Auth: either `AccessCookie` or `credentials` (as above)
  - Body: { videoKey, userAccessKey, userSecretAccessKey, bucketPath, userBucketName, email, AccessCookie } (or use `credentials` and omit AccessCookie)
  - Action: Deducts service charge from user SCSCoins and invokes `spinTranscoder` which runs an ECS Fargate task to transcode the file. Notification queued to email after completion.
  - Response 200: { success: true, message: 'transcoding process is queued. when transcoding completes we will notify through email' }

3) Payment routes 💳 (mounted at `/api/payment`)

- ➕ POST `/api/payment/create-order`
  - Body: { AccessCookie, paymentAmount, phoneNumber }
  - Action: Creates a Cashfree order for the logged-in user and returns gateway response to the client.
  - Response (success): { success: true, message: 'payment initiated successfully', data: { /* Cashfree order response */ } }

- ➕ POST `/api/payment/verify-payment`
  - Body: { AccessCookie, orderId }
  - Action: Fetches payment details from Cashfree, credits user SCSCoins with amount, creates Payment record, enqueues a notification job.
  - Response 200: { success: true, message: 'Payment Successful' }

- 🔎 GET `/api/payment/history`
  - Auth: `AccessCookie`
  - Action: Returns payment records for the user
  - Response 200: { success: true, message: 'successfully got payment history', data: [ payments ] }

4) Hosting routes 🌐 (mounted at `/api/host`)

- ➕ POST `/api/host/host-website`
  - Body: { AccessCookie, websiteName, websiteType, gitUrl }
  - Action: Deducts hosting fee from user and invokes `spinHoster` to run ECS task that deploys the repo to a bucket. Creates `Website` record with generated `webUrl` and `s3bucketUrl`. Returns website URL and validity date.
  - Response 201: { success: true, message: 'successfully hosted website...', data: { websiteUrl, validDate } }

- 🔎 GET `/api/host/websites`
  - Auth: `AccessCookie`
  - Action: Lists websites created by the user
  - Response 200: { success: true, message: 'successfully got websites data', data: [ websites ] }

- ➕ POST `/api/host/renew-validity`
  - Body: { AccessCookie, websiteId }
  - Action: Deducts hosting fee, extends `validDate` for the site by 30 days and enqueues renewal notification.
  - Response 201: { success: true, message: 'successfully increased validity of hosted website.' }

Proxy behavior 🌍 (non-API subdomains)
- `src/index.ts` includes an Express route that proxies requests for non-`api` subdomains to a static S3 website: `https://s3.ap-south-1.amazonaws.com/testingsuryansh.bucket/hosted-websites/{subdomain}`. If request path is `/` it will proxy to `index.html`.

Error handling ⚠️
- Controllers generally return HTTP 400 for client errors and 401 for unauthorized. Responses include { success: false, message, error }.

Model summary 🧩
- `User` (`src/models/user.model.ts`) — email, password (hashed), SCSCoins, accessKey, secretAccessKey, credentialsActive, refreshToken, payment stats.
- `Payment` (`src/models/payment.model.ts`) — paymentId, orderId, amount, userId, currency.
- `Website` (`src/models/hosting-website.model.ts`) — websiteUrl, s3bucketUrl (select:false), websiteName, validDate, websiteType.

Queues 📬
- `src/services/queue.service.ts` sets up BullMQ queues: Email, APIKEYS, Hosting, HostingRenewal, PaymentQueue. These are used to notify users and handle background tasks.

If you want runnable examples for each endpoint (curl, Postman collections) tell me which endpoints to prioritize and I will add example requests and expected JSON responses.

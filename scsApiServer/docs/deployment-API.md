# Deployment API

This document describes the deployment-related endpoints and controller behavior implemented in `src/routes/deployment.routes.ts` and `src/controllers/deployment.controller.ts`.

## Overview / Purpose

These endpoints let authenticated users create, list, and delete container deployments. The server uses a gRPC backend (`GetDeployments`, `DeployContainer`, `DeleteDeployment`) to interact with the container orchestration service.

Key files:
- `src/routes/deployment.routes.ts` — route definitions
- `src/controllers/deployment.controller.ts` — business logic and authentication checks
- `pb/containerService/Deployment` — protobuf Deployment message (used in types)

## Environment variables used

- `ACCESS_TOKEN_SECRET` — JWT secret used to verify `AuthCookie` values.
- `HOSTING_DOMAIN` — domain used to build public URLs for deployed services (e.g. `service-subdomain.${HOSTING_DOMAIN}`).
- `BUCKET_HOST_FOR_HOSTING` — (used elsewhere in the app) used for subdomain proxying/hosting.

## Endpoints

Base path: The router is mounted under `/api/v1` in `src/index.ts` (except the `create` and `delete` handlers use same router). Full paths below assume that base mounting.

1) GET /api/v1/getDeployments/:AuthCookie

- Description: Return a list of deployments for the authenticated user.
- Authentication: The `AuthCookie` path param is a JWT (signed with `ACCESS_TOKEN_SECRET`). The controller verifies it and extracts `userId`.
- Params:
  - `AuthCookie` (path) — required JWT string
- Response (200):
  - JSON with `deployments` property (array of `Deployment` protobuf objects). The controller injects a `url` field into each deployment in the form `http://{serviceSubdomain}.{HOSTING_DOMAIN}`.
- Errors:
  - 400 if `AuthCookie` missing
  - 401 if JWT verification fails
  - 500 if fetching deployments fails

Example request:

GET /api/v1/getDeployments/eyJhbGciOi... (AuthCookie in URL)

Example response (200):

{
  "status": 200,
  "message": "Deployments fetched successfully",
  "data": {
    "deployments": [
      {
        "name": "service-abc123",
        "dockerImage": "example/image:latest",
        "serviceSubdomain": "service-abc123",
        "url": "http://service-abc123.example.com",
        "replicas": 1,
        "port": 80,
        "cpu": 0.5,
        "memory": 512,
        "namespace": "container-service",
        "environments": []
      }
    ]
  }
}

2) POST /api/v1/createDeployment

- Description: Deploy a new container for the authenticated user.
- Authentication: `AuthCookie` should be passed in request body (see controller implementation). The controller verifies the JWT and reads `userId`.
- Body (JSON):
  - `AuthCookie` (string) — required JWT
  - `config` (object) — required. Fields supported (defaults applied if missing):
    - `dockerImage` (string) — required
    - `cpu` (number) — default 0.5
    - `memory` (number, MB) — default 512
    - `port` (number) — default 80
    - `replicas` (number) — default 1
    - `name` (string) — optional. If not provided, server generates a random name `service-xxxxx`.
    - `serviceSubdomain` (string) — optional. If not provided, server generates `service-xxxxx`.
    - `environments` (array of {key,string value,string}) — optional environment variables for the container
- Response (200):
  - JSON with `deploymentResult` (the created Deployment) and `url` for the service at `http://{serviceSubdomain}.{HOSTING_DOMAIN}`.
- Errors:
  - 400 if `AuthCookie` missing or `config.dockerImage` missing
  - 401 if JWT verification fails
  - 500 if backend gRPC fails to create deployment

Example request body:

POST /api/v1/createDeployment
Content-Type: application/json

{
  "AuthCookie": "eyJhbGci...",
  "config": {
    "dockerImage": "nginx:latest",
    "cpu": 0.5,
    "memory": 256,
    "port": 80,
    "replicas": 1,
    "serviceSubdomain": "my-service-123",
    "environments": [
      {"key":"ENV","value":"production"}
    ]
  }
}

Successful response (200):

{
  "status": 200,
  "message": "Container deployed successfully",
  "data": {
    "deploymentResult": { /* Deployment proto object */ },
    "url": "http://my-service-123.example.com"
  }
}

3) DELETE /api/v1/deleteDeployment

- Description: Delete a deployment by its ID.
- Body (JSON):
  - `deploymentId` (string) — required
- Response (200):
  - JSON with success message
- Errors:
  - 400 if `deploymentId` missing
  - 500 if deletion fails in backend

Example request body:

DELETE /api/v1/deleteDeployment
Content-Type: application/json

{
  "deploymentId": "deployment-uuid-or-id"
}

Successful response (200):

{
  "status": 200,
  "message": "Deployment deleted successfully",
  "data": {}
}

## Contracts / types

The controller expects/returns `Deployment` objects from the protobuf-generated types in `pb/containerService/Deployment` (TypeScript types live under `src/` after compilation). Typical fields used:
- `name`, `dockerImage`, `serviceSubdomain`, `replicas`, `port`, `cpu`, `memory`, `namespace`, `environments`.

## Error handling

Controllers use the `AppError` utility to throw errors with HTTP status codes. There's a centralized `errorHandler` middleware mounted in `src/index.ts` that formats errors. Any thrown `AppError` will be sent as a structured JSON response. For unexpected gRPC/backend failures, the controller typically throws or allows the `errorHandler` to return 500.

## Security notes

- JWT is used for authentication. Keep `ACCESS_TOKEN_SECRET` secure and rotate as needed.
- Avoid sending JWT in URLs in production — currently `getDeployments` reads `AuthCookie` from a URL param which may be logged; if you control client code, prefer placing the token in an Authorization header or secure cookie and update controller accordingly.

## Next steps / improvements

- Move `AuthCookie` handling to standard `Authorization: Bearer <token>` header for all endpoints.
- Add OpenAPI/Swagger doc with schemas for `Deployment` objects and request/response payloads.
- Add example cURL commands and Postman collection.
- Add integration tests that mock gRPC responses to validate controller behavior.

---

If you want, I can add the OpenAPI spec and example cURL/Postman requests next. Tell me which you'd prefer.
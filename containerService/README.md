# scsCloud Container Service 🚀

A lightweight gRPC microservice for managing user container deployments: create, list, and delete deployment records backed by PostgreSQL. Built with Go, ships with Docker assets, and now provisions Kubernetes resources (Deployment, Service, Ingress) on create.

## ✨ Features

- 🔌 gRPC API (with server reflection enabled) defined in `containerService.proto`
- 🗄️ PostgreSQL persistence with JSONB environments
- 🧱 Clean layering: repository (DB) ➜ service (logic) ➜ gRPC server (transport)
- 🐳 Dockerfiles for app and database; Compose for local Postgres
- ☸️ Kubernetes orchestration: creates Deployment, Service, and Ingress per request

## 🧭 Overview

This service exposes three RPCs:
- GetDeployments: List deployments by user ID
- CreateDeployment: Insert a new deployment
- DeleteDeployment: Remove a deployment by ID

Each deployment record includes image, CPU/memory, replicas, port, env key/values, and a service subdomain used to build an Ingress host.

## 🧱 Architecture

- `repository.go`: Postgres repo for CRUD using `database/sql` and `lib/pq`
- `service.go`: Business logic and data model (`Deployment`), thin pass‑through today
- `server.go`: gRPC server implementation mapping to `pb` messages
- `containerService.proto` → generated stubs in `pb/`
- `cmd/containerService/main.go`: Wiring: load env, connect DB with retry, run gRPC server
- `k8s/config.go`: Initializes a Kubernetes clientset from `~/.kube/config`
- `k8s/methods.go`: Low-level builders for K8s resources (Deployment/Service/Ingress)
- `k8s/main.go`: Orchestrates CreateContainer/DeleteContainer using a spec adapter

```
[gRPC client] ⇄ [server.go] ⇄ [service.go] ⇄ [repository.go] ⇄ [PostgreSQL]
```

## 📁 Directory

```
containerService/
├─ app.dockerfile                # Build and run the service container
├─ db.dockerfile                 # Postgres image with init SQL
├─ docker-compose.yaml           # Local Postgres (dev)
├─ up.sql                        # DB schema migration
├─ containerService.proto        # gRPC contract
├─ go.mod                        # Module + deps
├─ repository.go                 # Postgres repository
├─ service.go                    # Business logic + model
├─ server.go                     # gRPC server
├─ cmd/
│  └─ containerService/
│     └─ main.go                # Entry point
├─ k8s/
│  └─ config.go                 # Kubernetes client bootstrap
└─ pb/                          # Generated protobuf + gRPC code
```

## 🗄️ Data model

Table: `deployments`
- id (UUID text, default gen_random_uuid())
- user_id (varchar)
- namespace (varchar)
- name (varchar)
- docker_image (varchar)
- cpu, memory (varchar)
- replicas (int)
- port (int)
- environments (JSONB map<string,string>)
- created_at (timestamp)

See `up.sql` for the canonical schema.

## 🔧 Configuration

Environment variables:
- `DATABASE_URL` (required) — e.g. `postgres://scsuser:scspassword@localhost:5432/scsdb?sslmode=disable`
- `PORT` (optional, default 8080)
- `.env` is loaded in dev if present

## 🛠️ Local development

1) Start Postgres with Docker Compose (detached):

```bash
cd containerService
docker compose up -d
```

This launches Postgres with `up.sql` applied automatically.

2) Create a `.env` file next to `go.mod` (or export env vars):

```bash
cat > .env <<'EOF'
DATABASE_URL=postgres://scsuser:scspassword@localhost:5432/scsdb?sslmode=disable
PORT=8080
EOF
```

3) Run the service:

```bash
go run ./cmd/containerService
```

4) Or build a binary:

```bash
go build -o containerService ./cmd/containerService
./containerService
```

## 🐳 Docker (application)

Build the image:

```bash
docker build -f app.dockerfile -t scscloud/container-service:latest .
```

Run the container (Linux/host networking simplifies local DB access):

```bash
docker run --rm --network host \
  -e DATABASE_URL=postgres://scsuser:scspassword@localhost:5432/scsdb?sslmode=disable \
  -e PORT=8080 \
  scscloud/container-service:latest
```

Alternatively, you can create a second service in `docker-compose.yaml` and connect both to the same user-defined network.

## 🔌 gRPC API quickstart

Server reflection is enabled, so you can explore with `grpcurl`:

- List services

```bash
grpcurl -plaintext localhost:8080 list
```

- List methods on ContainerService

```bash
grpcurl -plaintext localhost:8080 list pb.ContainerService
```

- GetDeployments

```bash
grpcurl -plaintext -d '{"user_id":"USER123"}' localhost:8080 pb.ContainerService/GetDeployments
```

- CreateDeployment

```bash
grpcurl -plaintext -d '{
  "user_id": "USER123",
  "deployment": {
    "namespace": "testing",
    "name": "nginx",
    "docker_image": "nginx:1.27",
    "cpu": "250m",
    "memory": "256Mi",
    "replicas": 1,
    "port": 80,
    "environments": {"user":"suryansh"},
    "serviceSubdomain": "nginx-service"
  }
}' localhost:8080 pb.ContainerService/CreateDeployment
```

- DeleteDeployment

```bash
grpcurl -plaintext -d '{"id":"<DEPLOYMENT_ID>"}' localhost:8080 pb.ContainerService/DeleteDeployment
```

## ☸️ Kubernetes

When you call CreateDeployment, the service now also provisions Kubernetes resources:

- Deployment: labels pods with `app: <serviceSubdomain>`, sets replicas, image, ports, envs.
- Service: ClusterIP targeting the same port with selector `app: <serviceSubdomain>`.
- Ingress: host `<serviceSubdomain>.suryanshverma.live` with a path prefix `/` to the Service.

Implementation details:

- Adapter struct `k8s.K8sDeploymentSpec` avoids an import cycle between the service and k8s packages.
- Orchestrator `k8s.CreateContainer(spec)` creates resources and cleans up if later steps fail.
- Delete path calls `k8s.DeleteContainer(namespace, name)` which deletes Ingress → Service → Deployment.

Notes:
- Namespaces are taken verbatim from the request (`deployment.namespace`). Ensure the namespace exists in your cluster or create it first.
- Label and selectors use `serviceSubdomain` to avoid collision and define a stable routing key.

## 🧪 Regenerating protobufs

If you edit `containerService.proto`, regenerate the Go code:

```bash
# Install plugins if needed
# go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
# go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

protoc \
  --go_out=./pb --go_opt=paths=source_relative \
  --go-grpc_out=./pb --go-grpc_opt=paths=source_relative \
  containerService.proto
```

## ⚠️ Known issues and tips

- app.dockerfile path: The builder currently runs `go build` on `./cmd/account/main.go`. The correct entrypoint here is `./cmd/containerService/main.go`. Update the Dockerfile to point to the containerService path if builds fail.
- go.mod go directive: The `go` version is set to `1.25.3`, but the `go` directive should be major.minor (e.g., `1.25`). If you hit tooling errors, change it to `go 1.25`.
- UUID default: `up.sql` uses `gen_random_uuid()` which requires `pgcrypto`. If the DB init fails, add `CREATE EXTENSION IF NOT EXISTS pgcrypto;` to `up.sql` before the table creation.
- Networking: If the app container can’t reach Postgres, ensure both are on the same Docker network or use `--network host` on Linux.
- Ingress testing: If you use ingress-nginx locally, you can port-forward to inspect it: `kubectl -n ingress-nginx port-forward svc/ingress-nginx-controller 3000:80` and then browse `http://<serviceSubdomain>.suryanshverma.live` via hosts mapping.

## 🤝 Contributing

Issues and PRs are welcome. Please format Go code with `gofmt` and keep changes minimal and focused.

## 📄 License

Specify your license here (e.g., MIT). If unspecified, all rights reserved by the author.

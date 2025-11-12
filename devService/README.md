# 🚀 Dev Service (gRPC + Kubernetes Orchestrator)

## 📘 Overview

This service exposes a gRPC API to provision “developer services” as Kubernetes workloads. On Create it will:

- Create a PersistentVolume (hostPath) and PersistentVolumeClaim
- Create a Deployment running the requested Docker image
- Create a ClusterIP Service exposing the container port
- Create an Ingress routing traffic to serviceSubdomain.suryanshverma.live

State is persisted in PostgreSQL in a `deployments` table. The server exposes Server Reflection, so you can interact with it via grpcurl without client stubs.

## 🗂️ Repo layout

- `cmd/devService/main.go` – server entrypoint (loads env, connects to Postgres, starts gRPC)
- `service.go` – domain service and image alias mapping
- `server.go` – gRPC transport implementation (pb.DevService)
- `repository.go` – Postgres repository (CRUD on deployments)
- `k8s/*` – Kubernetes manifests and client-go operations
- `devService.proto`, `pb/*` – protobuf API and generated Go stubs
- `docker-compose.yaml`, `db.dockerfile`, `up.sql` – local Postgres with schema bootstrap
- `app.dockerfile` – container build (see Known Issues)

## ✨ Features

- List available container images by friendly alias
- Create/Get/List/Delete developer service deployments
- Start/Stop an existing deployment (recreate/delete K8s Deployment + Service)
- Creates PV/PVC with 10Gi hostPath storage mounted at `/home/kasm-user`

## 🛠️ Tech stack

- Go (module: `github.com/suryanshvermaa/scsCloud/devService`)
- gRPC with reflection (`google.golang.org/grpc`)
- PostgreSQL (driver `github.com/lib/pq`)
- Kubernetes client-go (`k8s.io/client-go` et al.)

## ✅ Prerequisites

- Go (recent stable; go.mod declares 1.25.x)
- Docker and Docker Compose (for local Postgres)
- protoc with Go plugins if you plan to regenerate stubs
	- `protoc-gen-go`, `protoc-gen-go-grpc`
- A Kubernetes cluster and kubeconfig at `~/.kube/config`
	- NGINX Ingress Controller installed
	- DNS record for `*.suryanshverma.live` pointing to your ingress (or adapt the code/hostnames)
- Host path on cluster nodes: `/mnt/devservice/<name>` must be writable by Kubelet (or replace hostPath with a StorageClass)

## ⚙️ Configuration

The server reads environment variables via envconfig:

- `DATABASE_URL` – Postgres connection string
- `PORT` – gRPC listen port (default 8080; example `.env` sets 4000)

Examples:

```env
DATABASE_URL=postgresql://scsuser:scspassword@localhost:5432/scsdb?sslmode=disable
PORT=4000
```

Note: `.env.example` shows `DatabaseURL` but the app expects `DATABASE_URL` (uppercase).

## ▶️ Quick start (local)

1) Start Postgres using the provided compose and schema

```bash
docker compose up -d database
```

The `db.dockerfile` copies `up.sql` which creates the `deployments` table on first boot.

2) Create `.env` in the repo root (see Configuration) and run the server

```bash
go run cmd/devService/main.go
```

If you see a panic about kubeconfig, ensure you have a Kubernetes context configured at `~/.kube/config` (see Troubleshooting).

## 🛰️ gRPC API

Service: `pb.DevService` (see `devService.proto`). Methods:

- `GetAvailableImages(GetAvailableImagesRequest) -> GetAvailableImagesResponse`
- `GetDevServices(GetDevServicesRequest{userId}) -> GetDevServicesResponse`
- `GetDevService(GetDevServiceRequest{deploymentId}) -> GetDevServiceResponse`
- `CreateDevService(CreateDevServiceRequest{deployment}) -> CreateDevServiceResponse`
- `DeleteDevService(DeleteDevServiceRequest{deploymentId}) -> DeleteDevServiceResponse`
- `StopDevService(StopDevServiceRequest{deploymentId}) -> StopDevServiceResponse`
- `StartDevService(StartDevServiceRequest{deploymentId}) -> StartDevServiceResponse`

Reflection is enabled. Example grpcurl calls (plaintext for local):

```bash
# List available images by alias
grpcurl -plaintext localhost:${PORT:-4000} pb.DevService/GetAvailableImages

# Create a dev service
grpcurl -plaintext -d '{
	"deployment": {
		"userId": "u123",
		"namespace": "testing",
		"name": "my-dev",
		"devServiceName": "ubuntu",         
		"cpu": "500m",
		"memory": "512Mi",
		"port": 8080,
		"unlockPass": "changeme",
		"serviceSubdomain": "my-dev-u123"
	}
}' localhost:${PORT:-4000} pb.DevService/CreateDevService

# Get all services for a user
grpcurl -plaintext -d '{"userId":"u123"}' localhost:${PORT:-4000} pb.DevService/GetDevServices

# Stop/Start/Delete by deploymentId
grpcurl -plaintext -d '{"deploymentId":"<id>"}' localhost:${PORT:-4000} pb.DevService/StopDevService
grpcurl -plaintext -d '{"deploymentId":"<id>"}' localhost:${PORT:-4000} pb.DevService/StartDevService
grpcurl -plaintext -d '{"deploymentId":"<id>"}' localhost:${PORT:-4000} pb.DevService/DeleteDevService
```

### 🖼️ Images and aliases

You can request images by alias. Current mapping (see `service.go`):

- `vs-code` -> `suryanshvermaaa/vs-code:1.0.0`
- `ubuntu`  -> `suryanshvermaa/ubuntu:1.0.0`
- `chrome`  -> `suryanshvermaa/chrome:1.0.0`
- `centos`  -> `suryanshvermaa/centos:1.0.0`

Use the alias in `deployment.devServiceName`.

## 🗄️ Data model (Postgres)

Table: `deployments` (see `up.sql`). Columns:

- `id` TEXT PRIMARY KEY default `gen_random_uuid()`
- `user_id`, `namespace`, `name`, `docker_image`, `cpu`, `memory`, `port`, `unlock_password`, `created_at`, `is_running`, `service_subdomain`

Important: `gen_random_uuid()` requires the `pgcrypto` extension. If you see `function gen_random_uuid() does not exist`, enable it:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

## ☸️ What gets created in Kubernetes

On Create:

- PV named `<name>-pv` using hostPath `/mnt/devservice/<name>`
- PVC named `<name>-pvc` bound to the PV
- Deployment with 1 replica, resources set from CPU/Memory, port from `deployment.port`, VNC_PW env set to `unlockPass`
- ClusterIP Service targeting the container port
- Ingress for host `serviceSubdomain.suryanshverma.live` with NGINX annotations for long-lived connections; TLS is not configured by default

On Delete: Ingress -> Service -> Deployment -> PVC -> PV (in that order)

## 🔧 Regenerating protobuf stubs (optional)

```bash
# Install once (paths may vary)
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# Generate
protoc \
	--go_out=. --go_opt=paths=source_relative \
	--go-grpc_out=. --go-grpc_opt=paths=source_relative \
	devService.proto
```

## 🐳 Docker

- `docker-compose.yaml` defines a `database` service using `db.dockerfile` and persists data in `postgres_data_v5` volume.
- `app.dockerfile` is intended to build the Go server into a small Alpine image.

### ⚠️ Known issues

- `app.dockerfile` currently builds `./cmd/account/main.go`, which does not exist in this repo. It should point to `./cmd/devService/main.go` and the output binary name should be updated accordingly.

## 🧰 Troubleshooting

- Panic: `invalid configuration: no configuration has been provided`
	- The Kubernetes client tries to load `~/.kube/config` at startup (see `k8s/config.go`). Ensure a kubeconfig exists and points to a reachable cluster. Alternatively run in-cluster or refactor to lazy-initialize the client.

- Server keeps retrying DB connection
	- The app retries until Postgres is reachable. Verify `DATABASE_URL`, that the `database` container is healthy, and that your host can reach it.

- SQL error: `gen_random_uuid` does not exist
	- Enable the `pgcrypto` extension in your database (see Data model above).

- Ingress not reachable
	- Ensure an NGINX Ingress Controller is installed and your DNS (or /etc/hosts for testing) resolves `serviceSubdomain.suryanshverma.live` to the ingress address. TLS is not configured by default.

- PV/PVC pending or pod cannot mount
	- The PV uses hostPath `/mnt/devservice/<name>` on the node. Create the directory on the node(s) and ensure permissions, or switch to a proper StorageClass.

## 📄 License

Not specified. Add a LICENSE file if needed.

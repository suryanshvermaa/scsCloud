# Kubernetes Cluster Setup and Application Deployment
## Creating a Kubernetes Cluster
```bash
 kind create cluster --name=suryansh-cluster --config=./cluster.yaml
 ```
 ## installing NGINX Ingress Controller
```bash
kubectl apply -f ./nginx-ingress-controller.yaml
```

## pods status
```bash
kubectl get pods -n ingress-nginx --watch
```

## applying manifests
Use the following ordered commands so you don't accidentally run only a selection of the lines. Run them one-by-one (or copy/paste them together) so the namespace is created first, infra (DB/Redis) comes up, then services and the API/frontend.

```bash
# 1) Create namespaces
kubectl apply -f ./namespace.yaml

# 2) Infrastructure: databases and cache
kubectl apply -f ./db -f ./redis-server -f ./postgres_db -f ./serviceAccount.yaml

# 3) Background services and workers
kubectl apply -f ./email-server -f ./hostingWorker -f ./transcodingWorker -f ./container-service

# 4) API, frontend and ingress
kubectl apply -f ./api-server -f ./frontend -f ./ingress.yaml
```

If you prefer a single command, you can run the four lines above joined with `&&` so they execute sequentially and stop on error.

## pods status
```bash
kubectl get pods -n scs-cloud --watch
```

 ## port-forwarding to access services
```bash
kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 3000:80
```

## cleaning up resources
```bash
kubectl delete -f ./namespace.yaml -f ./db -f ./redis-server -f ./postgres_db -f ./email-server -f ./api-server -f ./container-service -f ./frontend -f ./ingress.yaml
```

## deleting the cluster
```bash
 kind delete cluster --name=suryansh-cluster
 ```
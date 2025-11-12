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
```bash
kubectl apply -f ./namespace.yaml -f ./db -f ./redis-server
```
```bash
# Optional: Postgres for containerService
kubectl apply -f ./postgres_db
```
```bash
kubectl apply -f ./email-server -f ./api-server -f ./container-service -f ./frontend -f ./ingress.yaml
```

## pods status
```bash
kubectl get pods -n scs-cloud --watch
```

 ## port-forwarding to access services
```bash
kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 3000:80
```

## Notes for container-service manifests

- Secret: `container-service/secrets.yaml` defines base64 encoded `DATABASE_URL` and `PORT` (default 4000 in cluster)
- Deployment: confirm `containers[].ports[].containerPort` equals the `PORT` env; update image tag on new releases
- Service: `container-service/svc.yaml` should select `app: scs-container-service`; verify port 4000 mapping
- RBAC: `container-service/serviceAccount.yaml` binds `api-access` as cluster-admin (broad). Tighten for production (least privilege)
- Postgres: apply `postgres_db/` before container-service to satisfy `DATABASE_URL`

## cleaning up resources
```bash
kubectl delete -f ./namespace.yaml -f ./db -f ./redis-server -f ./postgres_db -f ./email-server -f ./api-server -f ./container-service -f ./frontend -f ./ingress.yaml
```

## deleting the cluster
```bash
 kind delete cluster --name=suryansh-cluster
 ```
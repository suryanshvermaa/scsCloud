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
kubectl apply -f ./email-server -f ./api-server -f ./frontend -f ./ingress.yaml
```

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
kubectl delete -f ./namespace.yaml -f ./db -f ./redis-server -f ./email-server -f ./api-server -f ./frontend -f ./ingress.yaml
```

## deleting the cluster
```bash
 kind delete cluster --name=suryansh-cluster
 ```
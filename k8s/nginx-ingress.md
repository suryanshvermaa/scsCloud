## installation
```bash
kubectl apply -f https://kind.sigs.k8s.io/examples/ingress/deploy-ingress-nginx.yaml
```

## port-forwarding to access services
```bash
kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 8080:80
```
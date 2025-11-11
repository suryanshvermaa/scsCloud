package k8s

import (
	"context"
)

// CreateContainer orchestrates Deployment, Service and Ingress creation using the lightweight spec.
func CreateContainer(deployment K8sDeploymentSpec) error {
	ctx := context.Background()

	if err := createK8sDeployment(ctx, deployment); err != nil {
		return err
	}

	if err := createK8sService(ctx, deployment); err != nil {
		deleteDeployment(ctx, deployment.Name, deployment.Namespace)
		return err
	}

	if err := createK8sIngress(ctx, deployment); err != nil {
		deleteDeployment(ctx, deployment.Name, deployment.Namespace)
		deleteService(ctx, deployment.Name, deployment.Namespace)
		return err
	}

	return nil
}

func DeleteContainer(namespace, name string) {
	ctx := context.Background()
	deleteIngress(ctx, name, namespace)
	deleteService(ctx, name, namespace)
	deleteDeployment(ctx, name, namespace)
}

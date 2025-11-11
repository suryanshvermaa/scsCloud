package k8s

import (
	"context"

	containerservice "github.com/suryanshvermaa/scsCloud/containerService"
)

func CreateContainer(deployment containerservice.Deployment) error {
	ctx := context.Background()

	if err := createK8sDeployment(ctx, deployment); err != nil {
		return err
	}

	if err := createK8sService(ctx, deployment); err != nil {
		deleteDeployment(ctx, deployment.Namespace, deployment.Name)
		return err
	}

	if err := createK8sIngress(ctx, deployment); err != nil {
		deleteDeployment(ctx, deployment.Namespace, deployment.Name)
		deleteService(ctx, deployment.Namespace, deployment.Name)
		return err
	}

	return nil
}

func DeleteContainer(namespace, name string) {
	ctx := context.Background()
	deleteIngress(ctx, namespace, name)
	deleteService(ctx, namespace, name)
	deleteDeployment(ctx, namespace, name)
}

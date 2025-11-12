package k8s

import (
	"context"
)

// CreateContainer orchestrates Deployment, Service and Ingress creation using the lightweight spec.
func CreateContainer(deployment Deployment) error {
	ctx := context.Background()

	if err := createPersistentVolumeNClaim(ctx, deployment); err != nil {
		return err
	}

	if err := createK8sDeployment(ctx, deployment); err != nil {
		deletePersistentVolumeClaim(ctx, deployment.Name+"-pvc", deployment.Namespace)
		deletePersistentVolume(ctx, deployment.Name+"-pv")
		return err
	}

	if err := createK8sService(ctx, deployment); err != nil {
		deletePersistentVolumeClaim(ctx, deployment.Name+"-pvc", deployment.Namespace)
		deletePersistentVolume(ctx, deployment.Name+"-pv")
		deleteDeployment(ctx, deployment.Name, deployment.Namespace)
		return err
	}

	if err := createK8sIngress(ctx, deployment); err != nil {
		deletePersistentVolumeClaim(ctx, deployment.Name+"-pvc", deployment.Namespace)
		deletePersistentVolume(ctx, deployment.Name+"-pv")
		deleteDeployment(ctx, deployment.Name, deployment.Namespace)
		deleteService(ctx, deployment.Name, deployment.Namespace)
		return err
	}

	return nil
}

func DeleteContainer(namespace, name string) error {
	ctx := context.Background()
	err := deleteIngress(ctx, name, namespace)
	if err != nil {
		return err
	}
	err = deleteService(ctx, name, namespace)
	if err != nil {
		return err
	}
	err = deleteDeployment(ctx, name, namespace)
	if err != nil {
		return err
	}
	err = deletePersistentVolumeClaim(ctx, name+"-pvc", namespace)
	if err != nil {
		return err
	}
	err = deletePersistentVolume(ctx, name+"-pv")
	return err
}

func StopDevService(namespace, name string) error {
	ctx := context.Background()
	err := deleteDeployment(ctx, name, namespace)
	if err != nil {
		return err
	}
	err = deleteService(ctx, name, namespace)
	return err
}

func StartDevService(deployment Deployment) error {
	ctx := context.Background()
	err := createK8sDeployment(ctx, deployment)
	if err != nil {
		return err
	}
	err = createK8sService(ctx, deployment)
	return err
}

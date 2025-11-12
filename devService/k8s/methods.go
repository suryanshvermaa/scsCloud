package k8s

import (
	"context"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func createK8sDeployment(ctx context.Context, d Deployment) error {
	dep := DeploymentManifest(d)
	_, err := clientset.AppsV1().Deployments(d.Namespace).Create(ctx, dep, metav1.CreateOptions{})
	return err
}

func createK8sService(ctx context.Context, d Deployment) error {
	svc := ServiceManifest(d)
	_, err := clientset.CoreV1().Services(d.Namespace).Create(ctx, svc, metav1.CreateOptions{})
	return err
}

func createK8sIngress(ctx context.Context, d Deployment) error {
	ing := IngressManifest(d)
	_, err := clientset.NetworkingV1().Ingresses(d.Namespace).Create(ctx, ing, metav1.CreateOptions{})
	return err
}

func createPersistentVolumeNClaim(ctx context.Context, d Deployment) error {
	pv := PersistentVolume(d)
	_, err := clientset.CoreV1().PersistentVolumes().Create(ctx, pv, metav1.CreateOptions{})
	if err != nil {
		return err
	}

	pvc := PersistentVolumeClaim(d)
	_, err = clientset.CoreV1().PersistentVolumeClaims(d.Namespace).Create(ctx, pvc, metav1.CreateOptions{})
	return err
}

func deleteDeployment(ctx context.Context, name string, namespace string) error {
	return clientset.AppsV1().Deployments(namespace).Delete(ctx, name, metav1.DeleteOptions{})
}

func deleteService(ctx context.Context, name string, namespace string) error {
	return clientset.CoreV1().Services(namespace).Delete(ctx, name, metav1.DeleteOptions{})
}

func deleteIngress(ctx context.Context, name string, namespace string) error {
	return clientset.NetworkingV1().Ingresses(namespace).Delete(ctx, name, metav1.DeleteOptions{})
}

func deletePersistentVolume(ctx context.Context, name string) error {
	return clientset.CoreV1().PersistentVolumes().Delete(ctx, name, metav1.DeleteOptions{})
}

func deletePersistentVolumeClaim(ctx context.Context, name string, namespace string) error {
	return clientset.CoreV1().PersistentVolumeClaims(namespace).Delete(ctx, name, metav1.DeleteOptions{})
}

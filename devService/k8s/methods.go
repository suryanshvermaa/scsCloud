package k8s

import (
	"context"

	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	networkingv1 "k8s.io/api/networking/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
)

type K8sDeploymentSpec struct {
	Name             string
	Namespace        string
	DockerImage      string
	Replicas         int
	Port             int
	Environments     map[string]string
	ServiceSubdomain string
}

func createK8sDeployment(ctx context.Context, d K8sDeploymentSpec) error {
	replicas := int32(d.Replicas)
	dep := &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name:      d.Name,
			Namespace: d.Namespace,
		},
		Spec: appsv1.DeploymentSpec{
			Replicas: &replicas,
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"app": d.ServiceSubdomain,
				},
			},
			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{
						"app": d.ServiceSubdomain,
					},
				},
				Spec: corev1.PodSpec{
					Containers: []corev1.Container{
						{
							Name:  d.Name,
							Image: d.DockerImage,
							Ports: []corev1.ContainerPort{
								{ContainerPort: int32(d.Port)},
							},
							Env: convertMapToEnvVars(d.Environments),
						},
					},
				},
			},
		},
	}

	_, err := clientset.AppsV1().Deployments(d.Namespace).Create(ctx, dep, metav1.CreateOptions{})
	return err
}

func convertMapToEnvVars(envs map[string]string) []corev1.EnvVar {
	vars := make([]corev1.EnvVar, 0, len(envs))
	for k, v := range envs {
		vars = append(vars, corev1.EnvVar{Name: k, Value: v})
	}
	return vars
}

func createK8sService(ctx context.Context, d K8sDeploymentSpec) error {
	svc := &corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      d.Name,
			Namespace: d.Namespace,
		},
		Spec: corev1.ServiceSpec{
			Selector: map[string]string{
				"app": d.ServiceSubdomain,
			},
			Ports: []corev1.ServicePort{
				{
					Port:       int32(d.Port),
					TargetPort: intstr.FromInt(d.Port),
				},
			},
			Type: corev1.ServiceTypeClusterIP,
		},
	}

	_, err := clientset.CoreV1().Services(d.Namespace).Create(ctx, svc, metav1.CreateOptions{})
	return err
}

func createK8sIngress(ctx context.Context, d K8sDeploymentSpec) error {
	ing := &networkingv1.Ingress{
		ObjectMeta: metav1.ObjectMeta{
			Name:      d.Name,
			Namespace: d.Namespace,
		},
		Spec: networkingv1.IngressSpec{
			Rules: []networkingv1.IngressRule{
				{
					Host: d.ServiceSubdomain + "." + "suryanshverma.live",
					IngressRuleValue: networkingv1.IngressRuleValue{
						HTTP: &networkingv1.HTTPIngressRuleValue{
							Paths: []networkingv1.HTTPIngressPath{
								{
									Path:     "/",
									PathType: func() *networkingv1.PathType { p := networkingv1.PathTypePrefix; return &p }(),
									Backend: networkingv1.IngressBackend{
										Service: &networkingv1.IngressServiceBackend{
											Name: d.Name,
											Port: networkingv1.ServiceBackendPort{
												Number: int32(d.Port),
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	}
	_, err := clientset.NetworkingV1().Ingresses(d.Namespace).Create(ctx, ing, metav1.CreateOptions{})
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

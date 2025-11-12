package k8s

import (
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
)

type Deployment struct {
	ID               string
	UserID           string
	Namespace        string
	Name             string
	DockerImage      string
	CPU              string
	Memory           string
	Port             int
	UnlockPass       string
	CreatedAt        string
	IsRunning        bool
	ServiceSubdomain string
}

func DeploymentManifest(d Deployment) *appsv1.Deployment {
	replicas := int32(1)
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
							Env: []corev1.EnvVar{
								{
									Name:  "VNC_PW",
									Value: d.UnlockPass,
								},
							},
							VolumeMounts: []corev1.VolumeMount{
								{
									Name:      d.Name + "-data",
									MountPath: "/home/kasm-user",
								},
							},
						},
					},
					Volumes: []corev1.Volume{
						{
							Name: d.Name + "-data",
							VolumeSource: corev1.VolumeSource{
								PersistentVolumeClaim: &corev1.PersistentVolumeClaimVolumeSource{
									ClaimName: d.Name + "-pvc",
								},
							},
						},
					},
				},
			},
		},
	}
	return dep
}

func ServiceManifest(d Deployment) *corev1.Service {
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
					Protocol: corev1.ProtocolTCP,
					Port:     int32(d.Port),
					TargetPort: func() intstr.IntOrString {
						return intstr.FromInt(d.Port)
					}(),
				},
			},
			Type: corev1.ServiceTypeClusterIP,
		},
	}
	return svc
}

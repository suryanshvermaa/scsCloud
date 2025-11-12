package k8s

import (
	networkingv1 "k8s.io/api/networking/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func IngressManifest(d Deployment) *networkingv1.Ingress {
	ing := &networkingv1.Ingress{
		ObjectMeta: metav1.ObjectMeta{
			Name:      d.Name,
			Namespace: d.Namespace,
			Annotations: map[string]string{
				"nginx.ingress.kubernetes.io/proxy-http-version": "1.1",
				"nginx.ingress.kubernetes.io/proxy-read-timeout": "3600",
				"nginx.ingress.kubernetes.io/proxy-send-timeout": "3600",
				"nginx.ingress.kubernetes.io/proxy-buffering":    "off",
				"nginx.ingress.kubernetes.io/backend-protocol":   "HTTPS",
				"nginx.ingress.kubernetes.io/proxy-ssl-verify":   "off",
			},
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
	return ing
}

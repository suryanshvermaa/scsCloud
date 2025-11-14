package k8s

import (
	"fmt"
	"os"
	"path/filepath"

	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"
)

var clientset = loadKubeConfig()

func loadKubeConfig() *kubernetes.Clientset {
	var (
		cfg    *rest.Config
		err    error
		source string
	)

	// Prefer in-cluster configuration when running inside a pod.
	// KUBERNETES_SERVICE_HOST env is set by kubelet; use it as a signal.
	if host := os.Getenv("KUBERNETES_SERVICE_HOST"); host != "" {
		cfg, err = rest.InClusterConfig()
		if err == nil {
			source = "in-cluster"
		} else {
			fmt.Printf("⚠️  InClusterConfig failed (%v); falling back to local kubeconfig.\n", err)
		}
	}

	// Fallback to local kubeconfig (useful for running locally outside cluster).
	if cfg == nil {
		kubeconfig := filepath.Join(homedir.HomeDir(), ".kube", "config")
		cfg, err = clientcmd.BuildConfigFromFlags("", kubeconfig)
		if err != nil {
			panic(fmt.Errorf("unable to build kubeconfig (in-cluster + local failed): %w", err))
		}
		source = kubeconfig
	}

	clientset, err := kubernetes.NewForConfig(cfg)
	if err != nil {
		panic(fmt.Errorf("unable to create k8s clientset: %w", err))
	}
	fmt.Printf("✅ Connected to cluster using %s configuration\n", source)
	return clientset
}

package containerservice

import "github.com/suryanshvermaa/scsCloud/containerService/k8s"

type Service interface {
	GetDeployments(userID string) ([]Deployment, error)
	CreateDeployment(userID, namespace, name, dockerImage, cpu, memory string, replicas, port int, environments map[string]string, serviceSubdomain string) (Deployment, error)
	DeleteDeployment(id string) error
}

type Deployment struct {
	ID               string            `json:"id"`
	UserID           string            `json:"user_id"`
	Namespace        string            `json:"namespace"`
	Name             string            `json:"name"`
	DockerImage      string            `json:"docker_image"`
	CPU              string            `json:"cpu"`
	Memory           string            `json:"memory"`
	Replicas         int               `json:"replicas"`
	Port             int               `json:"port"`
	Environments     map[string]string `json:"environments"`
	ServiceSubdomain string            `json:"service_subdomain"`
	CreatedAt        string            `json:"created_at"`
}

type containerService struct {
	repository Repository
}

func NewService(r Repository) Service {
	return &containerService{r}
}

// GetDeployments retrieves deployments for a specific user.
func (s *containerService) GetDeployments(userID string) ([]Deployment, error) {
	return s.repository.GetDeploymentsByUserID(userID)
}

// CreateDeployment creates a new deployment for a user.
func (s *containerService) CreateDeployment(userID, namespace, name, dockerImage, cpu, memory string, replicas, port int, environments map[string]string, serviceSubdomain string) (Deployment, error) {
	deployment := Deployment{
		UserID:           userID,
		Namespace:        namespace,
		Name:             name,
		DockerImage:      dockerImage,
		CPU:              cpu,
		Memory:           memory,
		Replicas:         replicas,
		Port:             port,
		Environments:     environments,
		ServiceSubdomain: serviceSubdomain,
	}
	// Orchestrate K8s resources with an adapter to avoid import cycles.
	err := k8s.CreateContainer(k8s.K8sDeploymentSpec{
		Name:             deployment.Name,
		Namespace:        deployment.Namespace,
		DockerImage:      deployment.DockerImage,
		Replicas:         deployment.Replicas,
		Port:             deployment.Port,
		Environments:     deployment.Environments,
		ServiceSubdomain: deployment.ServiceSubdomain,
	})
	if err != nil {
		return Deployment{}, err
	}
	return s.repository.CreateDeployment(deployment)
}

func (s *containerService) DeleteDeployment(id string) error {
	err := s.repository.DeleteDeployment(id)
	if err != nil {
		return err
	}
	return nil
}

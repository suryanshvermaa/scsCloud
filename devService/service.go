package devservice

import "github.com/suryanshvermaa/scsCloud/devService/k8s"

type Image struct {
	ImageName string
	Tag       string
	Alias     string
}

var AliasToImage map[string]string = map[string]string{
	"vs-code": "suryanshvermaaa/vs-code:1.0.0",
	"ubuntu":  "suryanshvermaa/ubuntu:1.0.0",
	"chrome":  "suryanshvermaa/chrome:1.0.0",
	"centos":  "suryanshvermaa/centos:1.0.0",
}

var Images []Image = []Image{
	{ImageName: "suryanshvermaaa/vs-code", Tag: "1.0.0", Alias: "vs-code"},
	{ImageName: "suryanshvermaa/ubuntu", Tag: "1.0.0", Alias: "ubuntu"},
	{ImageName: "suryanshvermaa/chrome", Tag: "1.0.0", Alias: "chrome"},
	{ImageName: "suryanshvermaa/centos", Tag: "1.0.0", Alias: "centos"},
}

type Service interface {
	GetAvailableImages() ([]string, error)
	GetDevServices(userID string) ([]k8s.Deployment, error)
	GetDevService(deploymentID string) (*k8s.Deployment, error)
	CreateDevService(deploy k8s.Deployment) (*k8s.Deployment, error)
	DeleteDevService(deploymentID string) error
	StopDevService(deploymentID string) error
	StartDevService(deploymentID string) error
}

type devService struct {
	repository Repository
}

func NewService(r Repository) Service {
	return &devService{r}
}

func (s *devService) GetAvailableImages() ([]string, error) {
	images := []string{}
	for _, img := range Images {
		images = append(images, img.Alias)
	}
	return images, nil
}

func (s *devService) GetDevServices(userID string) ([]k8s.Deployment, error) {
	return s.repository.GetDevServices(userID)
}

func (s *devService) GetDevService(deploymentID string) (*k8s.Deployment, error) {
	return s.repository.GetDevService(deploymentID)
}

func (s *devService) CreateDevService(deploy k8s.Deployment) (*k8s.Deployment, error) {
	err := k8s.CreateContainer(deploy)
	if err != nil {
		return nil, err
	}
	return s.repository.CreateDevService(deploy)
}

func (s *devService) DeleteDevService(deploymentID string) error {
	dep, err := s.repository.GetDevService(deploymentID)
	if err != nil {
		return err
	}
	err = k8s.DeleteContainer(dep.Namespace, dep.Name)
	if err != nil {
		return err
	}
	return s.repository.DeleteDevService(deploymentID)
}

func (s *devService) StopDevService(deploymentID string) error {
	dep, err := s.repository.GetDevService(deploymentID)
	if err != nil {
		return err
	}
	err = k8s.StopDevService(dep.Namespace, dep.Name)
	if err != nil {
		return err
	}
	return s.repository.StopDevService(deploymentID)
}

func (s *devService) StartDevService(deploymentID string) error {
	dep, err := s.repository.GetDevService(deploymentID)
	if err != nil {
		return err
	}
	err = k8s.StartDevService(*dep)
	if err != nil {
		return err
	}
	return s.repository.StartDevService(deploymentID)
}

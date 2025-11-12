package devservice

type Image struct {
	ImageName string
	Tag       string
	Alias     string
}

var aliasToImage map[string]string = map[string]string{
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

type Service interface {
	GetAvailableImages() ([]string, error)
	GetDevServices(userID string) ([]Deployment, error)
	GetDevService(deploymentID string) (*Deployment, error)
	CreateDevService(deploy Deployment) (*Deployment, error)
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

func (s *devService) GetDevServices(userID string) ([]Deployment, error) {
	return s.repository.GetDevServices(userID)
}

func (s *devService) GetDevService(deploymentID string) (*Deployment, error) {
	return s.repository.GetDevService(deploymentID)
}

func (s *devService) CreateDevService(deploy Deployment) (*Deployment, error) {
	return s.repository.CreateDevService(deploy)
}

func (s *devService) DeleteDevService(deploymentID string) error {
	return s.repository.DeleteDevService(deploymentID)
}

func (s *devService) StopDevService(deploymentID string) error {
	return s.repository.StopDevService(deploymentID)
}

func (s *devService) StartDevService(deploymentID string) error {
	return s.repository.StartDevService(deploymentID)
}

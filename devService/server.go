package devservice

import (
	"context"
	"fmt"
	"net"

	"github.com/suryanshvermaa/scsCloud/devService/k8s"
	"github.com/suryanshvermaa/scsCloud/devService/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type grpcServer struct {
	pb.UnimplementedDevServiceServer
	service Service
}

func ListenGRPC(s Service, port int) error {
	list, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return err
	}
	serv := grpc.NewServer()
	pb.RegisterDevServiceServer(serv, &grpcServer{service: s})
	reflection.Register(serv)
	return serv.Serve(list)
}

func (s *grpcServer) GetAvailableImages(ctx context.Context, req *pb.GetAvailableImagesRequest) (*pb.GetAvailableImagesResponse, error) {
	images, err := s.service.GetAvailableImages()
	if err != nil {
		return nil, err
	}
	return &pb.GetAvailableImagesResponse{Images: images}, nil
}

func (s *grpcServer) GetDevServices(ctx context.Context, req *pb.GetDevServicesRequest) (*pb.GetDevServicesResponse, error) {
	services, err := s.service.GetDevServices()
	if err != nil {
		return nil, err
	}
	deps := make([]*pb.Deployment, len(services))
	for _, service := range services {
		deps = append(deps, &pb.Deployment{
			Name:             service.Name,
			Port:             int32(service.Port),
			Id:               service.ID,
			UserId:           service.UserID,
			Namespace:        service.Namespace,
			DevServiceName:   service.Name,
			Cpu:              service.CPU,
			Memory:           service.Memory,
			UnlockPass:       service.UnlockPass,
			CreatedAt:        service.CreatedAt,
			ServiceSubdomain: service.ServiceSubdomain,
		})
	}
	return &pb.GetDevServicesResponse{Deployments: deps}, nil
}

func (s *grpcServer) GetDevService(ctx context.Context, req *pb.GetDevServiceRequest) (*pb.GetDevServiceResponse, error) {
	service, err := s.service.GetDevService(req.DeploymentId)
	if err != nil {
		return nil, err
	}
	dep := &pb.Deployment{
		Name:             service.Name,
		Port:             int32(service.Port),
		Id:               &service.ID,
		UserId:           service.UserID,
		Namespace:        service.Namespace,
		DevServiceName:   service.Name,
		Cpu:              service.CPU,
		Memory:           service.Memory,
		UnlockPass:       service.UnlockPass,
		CreatedAt:        service.CreatedAt,
		ServiceSubdomain: service.ServiceSubdomain,
	}
	return &pb.GetDevServiceResponse{Deployment: dep}, nil
}

func (s *grpcServer) CreateDevService(ctx context.Context, req *pb.CreateDevServiceRequest) (*pb.CreateDevServiceResponse, error) {
	dep := k8s.Deployment{
		Name:             req.Deployment.Name,
		UserID:           req.Deployment.UserId,
		Namespace:        req.Deployment.Namespace,
		DockerImage:      AliasToImage[req.Deployment.DevServiceName],
		CPU:              req.Deployment.Cpu,
		Memory:           req.Deployment.Memory,
		Port:             int(req.Deployment.Port),
		UnlockPass:       req.Deployment.UnlockPass,
		CreatedAt:        req.Deployment.CreatedAt,
		IsRunning:        false,
		ServiceSubdomain: req.Deployment.ServiceSubdomain,
	}
	service, err := s.service.CreateDevService(dep)
	if err != nil {
		return nil, err
	}
	createdDep := &pb.Deployment{
		Name:             service.Name,
		Port:             int32(service.Port),
		Id:               &service.ID,
		UserId:           service.UserID,
		Namespace:        service.Namespace,
		DevServiceName:   service.Name,
		Cpu:              service.CPU,
		Memory:           service.Memory,
		UnlockPass:       service.UnlockPass,
		CreatedAt:        service.CreatedAt,
		ServiceSubdomain: service.ServiceSubdomain,
	}
	return &pb.CreateDevServiceResponse{Deployment: createdDep}, nil
}

package containerservice

import (
	"context"
	"fmt"
	"net"

	"github.com/suryanshvermaa/scsCloud/containerService/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type grpcServer struct {
	pb.UnimplementedContainerServiceServer
	service Service
}

func ListenGRPC(s Service, port int) error {
	list, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return err
	}
	serv := grpc.NewServer()
	pb.RegisterContainerServiceServer(serv, &grpcServer{service: s})
	reflection.Register(serv)
	return serv.Serve(list)
}

// GetDeployments retrieves deployments for a user.
func (s *grpcServer) GetDeployments(ctx context.Context, req *pb.GetDeploymentRequest) (*pb.GetDeploymentsResponse, error) {
	deployments, err := s.service.GetDeployments(req.UserId)
	if err != nil {
		return nil, err
	}
	var pbDeployments []*pb.Deployment
	for _, d := range deployments {
		pbDeployment := &pb.Deployment{
			Name:         d.Name,
			Namespace:    d.Namespace,
			DockerImage:  d.DockerImage,
			Cpu:          d.CPU,
			Memory:       d.Memory,
			Replicas:     int32(d.Replicas),
			Port:         int32(d.Port),
			Environments: d.Environments,
			CreatedAt:    d.CreatedAt,
		}
		pbDeployments = append(pbDeployments, pbDeployment)
	}
	return &pb.GetDeploymentsResponse{Deployments: pbDeployments}, nil
}

// CreateDeployment creates a new deployment.
func (s *grpcServer) CreateDeployment(ctx context.Context, req *pb.PostDeploymentRequest) (*pb.PostDeploymentResponse, error) {
	res, err := s.service.CreateDeployment(req.UserId, req.Deployment.Name, req.Deployment.Namespace, req.Deployment.DockerImage, req.Deployment.Cpu, req.Deployment.Memory, int(req.Deployment.Replicas), int(req.Deployment.Port), req.Deployment.Environments)
	if err != nil {
		return nil, err
	}
	return &pb.PostDeploymentResponse{Id: res.ID, Deployment: &pb.Deployment{
		Namespace:    res.Namespace,
		Name:         res.Name,
		DockerImage:  res.DockerImage,
		Cpu:          res.CPU,
		Memory:       res.Memory,
		Replicas:     int32(res.Replicas),
		Port:         int32(res.Port),
		Environments: res.Environments,
		CreatedAt:    res.CreatedAt,
	}}, nil
}

// DeleteDeployment deletes a deployment.
func (s *grpcServer) DeleteDeployment(ctx context.Context, req *pb.DeleteDeploymentRequest) (*pb.DeleteDeploymentResponse, error) {
	err := s.service.DeleteDeployment(req.Name)
	if err != nil {
		return nil, err
	}
	return &pb.DeleteDeploymentResponse{Message: "Deployment deleted successfully"}, nil
}

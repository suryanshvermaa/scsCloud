package devservice

import (
	"fmt"
	"net"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type grpcServer struct {
	// pb.UnimplementedContainerServiceServer
	service Service
}

func ListenGRPC(s Service, port int) error {
	list, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return err
	}
	serv := grpc.NewServer()
	// pb.RegisterContainerServiceServer(serv, &grpcServer{service: s})
	reflection.Register(serv)
	return serv.Serve(list)
}

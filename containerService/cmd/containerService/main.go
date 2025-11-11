package main

import (
	"log"
	"time"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
	containerservice "github.com/suryanshvermaa/scsCloud/containerService"
	"github.com/tinrab/retry"
)

type Config struct {
	DatabaseURL string `envconfig:"DATABASE_URL"`
	Port        int    `envconfig:"PORT" default:"8080"`
}

func main() {
	// for development
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("No .env file found")
	}

	var cfg Config
	err = envconfig.Process("", &cfg)
	if err != nil {
		panic(err)
	}
	var r containerservice.Repository
	retry.ForeverSleep(2*time.Second, func(_ int) (err error) {
		r, err = containerservice.NewPostgresRepository(cfg.DatabaseURL)
		if err != nil {
			log.Println(err)
		}
		return nil
	})
	defer r.Close()
	log.Println("Listening on port", cfg.Port)
	s := containerservice.NewService(r)
	log.Fatal(containerservice.ListenGRPC(s, cfg.Port))
}

package main

import (
	"log"
	"time"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
	devservice "github.com/suryanshvermaa/scsCloud/devService"
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
	var r devservice.Repository
	// Keep trying to connect until the DB is reachable. If NewPostgresRepository
	// returns an error, propagate it so the retry loop continues.
	retry.ForeverSleep(2*time.Second, func(_ int) (err error) {
		r, err = devservice.NewPostgresRepository(cfg.DatabaseURL)
		if err != nil {
			log.Println("db connect failed:", err)
			return err
		}
		return nil
	})
	if r != nil {
		defer r.Close()
	}
	log.Println("Listening on port", cfg.Port)
	s := devservice.NewService(r)
	log.Fatal(devservice.ListenGRPC(s, cfg.Port))
}

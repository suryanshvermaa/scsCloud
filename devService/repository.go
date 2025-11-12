package devservice

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type Repository interface {
	Close()
	GetAvailableImages() ([]string, error)
	GetDevServices(userID string) ([]Deployment, error)
	GetDevService(deploymentID string) (*Deployment, error)
	CreateDevService(deploy Deployment) (*Deployment, error)
	DeleteDevService(deploymentID string) error
	StopDevService(deploymentID string) error
	StartDevService(deploymentID string) error
}

type postgresRepository struct {
	db *sql.DB
}

func NewPostgresRepository(url string) (Repository, error) {
	db, err := sql.Open("postgres", url)
	if err != nil {
		return nil, err
	}
	err = db.Ping()
	if err != nil {
		return nil, err
	}
	return &postgresRepository{db}, nil
}

// Close closes the database connection.
func (r *postgresRepository) Close() {
	r.db.Close()
}

// Ping checks the database connection.
func (r *postgresRepository) Ping() error {
	return r.db.Ping()
}

// id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id VARCHAR(24) NOT NULL,
//   namespace VARCHAR(50) NOT NULL,
//   name VARCHAR(100) NOT NULL,
//   docker_image VARCHAR(200) NOT NULL,
//   cpu VARCHAR(20) NOT NULL,
//   memory VARCHAR(20) NOT NULL,
//   port INT NOT NULL,
//   unlock_password VARCHAR(30) NOT NULL,
//   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   is_running BOOLEAN NOT NULL DEFAULT TRUE,
//   service_subdomain VARCHAR(150) NOT NULL UNIQUE

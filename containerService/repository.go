package containerservice

import (
	"database/sql"
	"encoding/json"

	_ "github.com/lib/pq"
)

type Repository interface {
	Close()
	GetDeploymentsByUserID(userID string) ([]Deployment, error)
	CreateDeployment(deployment Deployment) (Deployment, error)
	DeleteDeployment(name string) error
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

// GetDeploymentsByUserID retrieves deployments for a specific user.
func (r *postgresRepository) GetDeploymentsByUserID(userID string) ([]Deployment, error) {
	rows, err := r.db.Query("SELECT id, user_id, namespace, name, docker_image, cpu, memory, replicas, port, environments, created_at FROM deployments WHERE user_id = $1", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var deployments []Deployment
	for rows.Next() {
		var d Deployment
		var envData []byte
		if err := rows.Scan(&d.ID, &d.UserID, &d.Namespace, &d.Name, &d.DockerImage, &d.CPU, &d.Memory, &d.Replicas, &d.Port, &envData, &d.CreatedAt); err != nil {
			return nil, err
		}
		// Unmarshal JSONB environments into the map
		envs := make(map[string]string)
		if len(envData) > 0 {
			if err := json.Unmarshal(envData, &envs); err != nil {
				return nil, err
			}
		}
		d.Environments = envs
		deployments = append(deployments, d)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return deployments, nil
}

// CreateDeployment creates a new deployment record in the database.
func (r *postgresRepository) CreateDeployment(deployment Deployment) (Deployment, error) {
	// Marshal environments to JSON for JSONB column
	envJSON, err := json.Marshal(deployment.Environments)
	if err != nil {
		return Deployment{}, err
	}
	err = r.db.QueryRow(
		"INSERT INTO deployments (user_id, namespace, name, docker_image, cpu, memory, replicas, port, environments) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, created_at",
		deployment.UserID, deployment.Namespace, deployment.Name, deployment.DockerImage, deployment.CPU, deployment.Memory, deployment.Replicas, deployment.Port, envJSON,
	).Scan(&deployment.ID, &deployment.CreatedAt)
	if err != nil {
		return Deployment{}, err
	}
	return deployment, nil
}

// parseEnvironments parses a serialized environment string into a map.
// (old semicolon-serialization removed) environments are stored as JSONB in DB

func (r *postgresRepository) DeleteDeployment(name string) error {
	_, err := r.db.Exec("DELETE FROM deployments WHERE name = $1", name)
	return err
}

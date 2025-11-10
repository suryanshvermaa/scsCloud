package containerservice

import (
	"database/sql"
	"strings"

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
		var envData string
		if err := rows.Scan(&d.ID, &d.UserID, &d.Namespace, &d.Name, &d.DockerImage, &d.CPU, &d.Memory, &d.Replicas, &d.Port, &envData, &d.CreatedAt); err != nil {
			return nil, err
		}
		d.Environments = parseEnvironments(envData)
		deployments = append(deployments, d)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return deployments, nil
}

// CreateDeployment creates a new deployment record in the database.
func (r *postgresRepository) CreateDeployment(deployment Deployment) (Deployment, error) {
	envData := serializeEnvironments(deployment.Environments)
	err := r.db.QueryRow(
		"INSERT INTO deployments (user_id, namespace, name, docker_image, cpu, memory, replicas, port, environments) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, created_at",
		deployment.UserID, deployment.Namespace, deployment.Name, deployment.DockerImage, deployment.CPU, deployment.Memory, deployment.Replicas, deployment.Port, envData,
	).Scan(&deployment.ID, &deployment.CreatedAt)
	if err != nil {
		return Deployment{}, err
	}
	return deployment, nil
}

// parseEnvironments parses a serialized environment string into a map.
func parseEnvironments(data string) map[string]string {
	envs := make(map[string]string)
	if data == "" {
		return envs
	}
	pairs := strings.Split(data, ";")
	for _, pair := range pairs {
		if pair == "" {
			continue
		}
		kv := strings.SplitN(pair, "=", 2)
		if len(kv) == 2 {
			key := strings.TrimSpace(kv[0])
			envs[key] = kv[1]
		}
	}
	return envs
}

// serializeEnvironments serializes a map of environment variables into a string.
func serializeEnvironments(envs map[string]string) string {
	var data string
	for k, v := range envs {
		if data != "" {
			data += ";"
		}
		data += k + "=" + v
	}
	return data
}

func (r *postgresRepository) DeleteDeployment(name string) error {
	_, err := r.db.Exec("DELETE FROM deployments WHERE name = $1", name)
	return err
}

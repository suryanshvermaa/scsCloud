package devservice

import (
	"database/sql"

	_ "github.com/lib/pq"
	"github.com/suryanshvermaa/scsCloud/devService/k8s"
)

type Repository interface {
	Close()
	GetDevServices(userID string) ([]k8s.Deployment, error)
	GetDevService(deploymentID string) (*k8s.Deployment, error)
	CreateDevService(deploy k8s.Deployment) (*k8s.Deployment, error)
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

func (r *postgresRepository) GetDevServices(userID string) ([]k8s.Deployment, error) {
	sqlQuery := `SELECT id, user_id, namespace, name, docker_image, cpu, memory, port, unlock_password, created_at, is_running, service_subdomain FROM deployments WHERE user_id=$1`
	rows, err := r.db.Query(sqlQuery, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var deployments []k8s.Deployment
	for rows.Next() {
		var d k8s.Deployment
		err := rows.Scan(&d.ID, &d.UserID, &d.Namespace, &d.Name, &d.DockerImage, &d.CPU, &d.Memory, &d.Port, &d.UnlockPass, &d.CreatedAt, &d.IsRunning, &d.ServiceSubdomain)
		if err != nil {
			return nil, err
		}
		deployments = append(deployments, d)
	}
	return deployments, nil
}

func (r *postgresRepository) GetDevService(deploymentID string) (*k8s.Deployment, error) {
	sqlQuery := `SELECT id, user_id, namespace, name, docker_image, cpu, memory, port, unlock_password, created_at, is_running, service_subdomain FROM deployments WHERE id=$1`
	row := r.db.QueryRow(sqlQuery, deploymentID)

	var d k8s.Deployment
	err := row.Scan(&d.ID, &d.UserID, &d.Namespace, &d.Name, &d.DockerImage, &d.CPU, &d.Memory, &d.Port, &d.UnlockPass, &d.CreatedAt, &d.IsRunning, &d.ServiceSubdomain)
	if err != nil {
		return nil, err
	}
	return &d, nil
}

func (r *postgresRepository) CreateDevService(deploy k8s.Deployment) (*k8s.Deployment, error) {
	sqlQuery := `INSERT INTO deployments (user_id, namespace, name, docker_image, cpu, memory, port, unlock_password, is_running, service_subdomain) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, created_at`
	err := r.db.QueryRow(sqlQuery, deploy.UserID, deploy.Namespace, deploy.Name, deploy.DockerImage, deploy.CPU, deploy.Memory, deploy.Port, deploy.UnlockPass, deploy.IsRunning, deploy.ServiceSubdomain).Scan(&deploy.ID, &deploy.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &deploy, nil
}

func (r *postgresRepository) DeleteDevService(deploymentID string) error {
	sqlQuery := `DELETE FROM deployments WHERE id=$1`
	_, err := r.db.Exec(sqlQuery, deploymentID)
	return err
}

func (r *postgresRepository) StopDevService(deploymentID string) error {
	sqlQuery := `UPDATE deployments SET is_running=FALSE WHERE id=$1`
	_, err := r.db.Exec(sqlQuery, deploymentID)
	return err
}

func (r *postgresRepository) StartDevService(deploymentID string) error {
	sqlQuery := `UPDATE deployments SET is_running=TRUE WHERE id=$1`
	_, err := r.db.Exec(sqlQuery, deploymentID)
	return err
}

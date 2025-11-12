import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/deployment`;

export interface EnvironmentVar {
  key: string;
  value: string;
}

export interface DeploymentConfig {
  dockerImage: string;
  cpu?: number; // cores
  memory?: string; // e.g. "10Gi"
  port?: number;
  replicas?: number;
  environments?: EnvironmentVar[];
}

export interface Deployment {
  id?: string;
  name: string;
  dockerImage: string;
  serviceSubdomain: string;
  url?: string;
  replicas: number;
  port: number;
  cpu: number;
  memory: string | number;
  namespace?: string;
  environments?: EnvironmentVar[];
}

// Fetch deployments for current user
export const getDeployments = async (): Promise<Deployment[]> => {
  const accessToken = Cookies.get('AccessCookie');
  if (!accessToken) throw new Error('Not authenticated');
  const response = await axios.get(`${API_BASE_URL}/getDeployments/${accessToken}`);
  return response.data.data.deployments as Deployment[];
};

// Create a new deployment
export const createDeployment = async (config: DeploymentConfig): Promise<{ deploymentResult: Deployment; url: string; }> => {
  const accessToken = Cookies.get('AccessCookie');
  if (!accessToken) throw new Error('Not authenticated');
  const response = await axios.post(`${API_BASE_URL}/createDeployment`, {
    AuthCookie: accessToken,
    config,
  });
  return response.data.data as { deploymentResult: Deployment; url: string; };
};

// Delete deployment by id
export const deleteDeployment = async (deploymentId: string): Promise<void> => {
  const accessToken = Cookies.get('AccessCookie');
  await axios.delete(`${API_BASE_URL}/deleteDeployment`, {
    data: { AccessCookie: accessToken, deploymentId },
  });
};

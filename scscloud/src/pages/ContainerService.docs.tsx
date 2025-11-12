import React from "react";
import DocsLayout from "../components/docs/DocsLayout";

const ContainerServiceDocs: React.FC = () => {
  return (
    <DocsLayout title="Container Service">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p>
          The <strong>Container Service</strong> lets you deploy and manage containerized workloads similarly to AWS ECS, Google Cloud Run, or Azure Container Apps. You supply a public Docker image and resource settings, and the platform provisions and exposes your service under a unique subdomain.
        </p>
        <h3>Key Features</h3>
        <ul>
          <li>Simple one-click deployments from any public Docker image.</li>
          <li>Configurable replicas, CPU cores, memory, and port.</li>
          <li>Automatic URL generation: <code>http://&lt;serviceSubdomain&gt;.your-hosting-domain</code>.</li>
          <li>Environment variables injection at deploy time.</li>
        </ul>
        <h3>Authentication</h3>
        <p>
          Endpoints use a JWT (stored in <code>AccessCookie</code>) currently passed as a path parameter for listing deployments and in the JSON body for creation. For production use, prefer a standard <code>Authorization: Bearer &lt;token&gt;</code> header to avoid exposing tokens in logs and analytics. Rotation of <code>ACCESS_TOKEN_SECRET</code> is recommended.
        </p>
        <h3>API Endpoints</h3>
        <pre><code>{`GET /api/v1/deployment/getDeployments/:AuthCookie\nPOST /api/v1/deployment/createDeployment\nDELETE /api/v1/deployment/deleteDeployment`}</code></pre>
        <h4>List Deployments</h4>
        <pre><code>{`curl -X GET "$VITE_API_URL/api/v1/deployment/getDeployments/$ACCESS_COOKIE" \
  -H "Accept: application/json"`}</code></pre>
        <h4>Create Deployment</h4>
        <pre><code>{`curl -X POST "$VITE_API_URL/api/v1/deployment/createDeployment" \
  -H "Content-Type: application/json" \
  -d '{
    "AuthCookie": "\$ACCESS_COOKIE",
    "config": {
      "dockerImage": "nginx:latest",
      "cpu": 0.5,
      "memory": "10Gi",
      "port": 80,
      "replicas": 1,
      "environments": [ { "key": "ENV", "value": "production" } ]
    }
  }'`}</code></pre>
        <h4>Delete Deployment</h4>
        <pre><code>{`curl -X DELETE "$VITE_API_URL/api/v1/deployment/deleteDeployment" \
  -H "Content-Type: application/json" \
  -d '{"deploymentId": "deployment-name-or-id"}'`}</code></pre>
        <h3>TypeScript Usage</h3>
        <pre><code>{`import { getDeployments, createDeployment } from '../utils/containerServiceApi';\n\nconst deployments = await getDeployments();\nawait createDeployment({ dockerImage: 'nginx:latest', replicas: 2 });`}</code></pre>
        <h3>Environment Variables Object</h3>
        <p>
          Provide an array of <code>{`[{ key: 'ENV', value: 'production' }]`}</code>. Empty <code>key</code> entries are discarded client-side before sending the request.
        </p>
        <h3>Next Steps</h3>
        <ul>
          <li>Add autoscaling policies (CPU / memory thresholds).</li>
          <li>Support rolling updates and deployment history.</li>
          <li>Expose service logs &amp; metrics dashboard.</li>
          <li>Migrate AuthCookie usage to headers consistently.</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default ContainerServiceDocs;

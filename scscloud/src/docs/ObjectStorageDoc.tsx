import React from "react";

const ObjectStorageDoc: React.FC = () => {
  return (
    <>
      <h1 className="text-3xl font-semibold text-gray-700 text-start mt-5">
        3) Object Storage Service
      </h1>
      <div className="paragraph">
        <p className="md:ml-6 ml-1">
          Object Storage is an S3-compatible service that provides scalable storage for any type of data.
          Perfect for storing files, backups, media assets, and application data. This documentation will
          guide you through enabling and using the service.
        </p>

        <div className="rounded-md border border-gray-300 my-4 bg-white">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">
            architecture
          </div>
          <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
            <code className="text-sm font-mono leading-relaxed">
              {`Application/Client
        ↓
    API Request (with AccessKey)
        ↓
    ┌─────────────────────────┐
    │   Object Storage API    │
    └─────────────────────────┘
        ↓           ↓
    Buckets    Pre-signed URLs
        ↓           ↓
    Objects    Secure Upload/Download`}
            </code>
          </pre>
        </div>

        <h1 className="text-2xl font-semibold text-gray-700 text-start mt-5">
          Getting Started
        </h1>

        <h2 className="text-xl font-semibold text-gray-700 text-start mt-4">
          1. Enable Object Storage Service
        </h2>
        <p className="md:ml-6 ml-1">
          First, enable the service from the dashboard. Choose your storage size in GB (minimum 1 GB).
          The cost will be deducted from your SCS Coins and the service will be valid for 1 month.
        </p>
        <div className="rounded-md border border-gray-300 my-4 bg-white">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">
            important
          </div>
          <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
            <code className="text-sm font-mono leading-relaxed">
              {`⚠️ IMPORTANT: Save Your Credentials

When you enable the service, you'll receive:
- Storage Endpoint
- Access Key ID
- Secret Access Key

Save these credentials immediately. You won't be able
to view the secret key again!`}
            </code>
          </pre>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 text-start mt-4">
          2. Create a Bucket
        </h2>
        <p className="md:ml-6 ml-1">
          Buckets are containers for storing objects. Before uploading files, you need to create a bucket.
        </p>
        <p className="md:ml-6 ml-1 font-semibold">Bucket Naming Rules:</p>
        <ul className="list-disc md:ml-12 ml-6 space-y-1">
          <li>Must be 3-63 characters long</li>
          <li>Lowercase letters, numbers, and hyphens only</li>
          <li>Must start and end with a letter or number</li>
          <li>Must be globally unique</li>
        </ul>

        <div className="rounded-md border border-gray-300 my-4 bg-white">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">
            examples
          </div>
          <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
            <code className="text-sm font-mono leading-relaxed">
              {`✓ Valid bucket names:
  - my-app-assets
  - user-uploads-2024
  - backup-bucket-prod

✗ Invalid bucket names:
  - MyBucket (uppercase not allowed)
  - my_bucket (underscores not allowed)
  - -mybucket (can't start with hyphen)
  - ab (too short)`}
            </code>
          </pre>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 text-start mt-4">
          3. Upload Objects
        </h2>
        <p className="md:ml-6 ml-1">
          Upload files through the dashboard by selecting a bucket and clicking "Upload Object".
          The system will generate a pre-signed URL for secure uploads.
        </p>

        <h2 className="text-xl font-semibold text-gray-700 text-start mt-4">
          4. Using with AWS SDK
        </h2>
        <p className="md:ml-6 ml-1">
          Since our Object Storage is S3-compatible, you can use the AWS SDK to interact with it
          programmatically.
        </p>

        <h3 className="text-lg font-semibold text-gray-700 text-start mt-3 md:ml-6 ml-1">
          Node.js Example
        </h3>
        <div className="rounded-md border border-gray-300 my-4 bg-white">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">
            javascript
          </div>
          <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
            <code className="text-sm font-mono leading-relaxed">
              {`// Install AWS SDK
// npm install @aws-sdk/client-s3

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Configure S3 client
const s3Client = new S3Client({
  region: "us-east-1", // Required but not used
  endpoint: "YOUR_STORAGE_ENDPOINT", // From credentials
  credentials: {
    accessKeyId: "YOUR_ACCESS_KEY_ID",
    secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
  },
  forcePathStyle: true, // Required for S3-compatible storage
});

// Upload a file
async function uploadFile(bucketName, fileName, fileContent) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent,
  });

  try {
    const response = await s3Client.send(command);
    console.log("Upload successful:", response);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

// Get a pre-signed download URL
async function getDownloadUrl(bucketName, fileName) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error("Failed to generate URL:", error);
  }
}`}
            </code>
          </pre>
        </div>

        <h3 className="text-lg font-semibold text-gray-700 text-start mt-3 md:ml-6 ml-1">
          Python Example
        </h3>
        <div className="rounded-md border border-gray-300 my-4 bg-white">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">
            python
          </div>
          <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
            <code className="text-sm font-mono leading-relaxed">
              {`# Install boto3
# pip install boto3

import boto3
from botocore.client import Config

# Configure S3 client
s3_client = boto3.client(
    's3',
    endpoint_url='YOUR_STORAGE_ENDPOINT',
    aws_access_key_id='YOUR_ACCESS_KEY_ID',
    aws_secret_access_key='YOUR_SECRET_ACCESS_KEY',
    config=Config(signature_version='s3v4'),
    region_name='us-east-1'
)

# Upload a file
def upload_file(bucket_name, file_path, object_name):
    try:
        s3_client.upload_file(file_path, bucket_name, object_name)
        print(f"File {file_path} uploaded to {bucket_name}/{object_name}")
    except Exception as e:
        print(f"Upload failed: {e}")

# Download a file
def download_file(bucket_name, object_name, file_path):
    try:
        s3_client.download_file(bucket_name, object_name, file_path)
        print(f"Downloaded {object_name} to {file_path}")
    except Exception as e:
        print(f"Download failed: {e}")

# List objects in a bucket
def list_objects(bucket_name):
    try:
        response = s3_client.list_objects_v2(Bucket=bucket_name)
        for obj in response.get('Contents', []):
            print(f"- {obj['Key']} ({obj['Size']} bytes)")
    except Exception as e:
        print(f"List failed: {e}")`}
            </code>
          </pre>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 text-start mt-4">
          Best Practices
        </h2>
        <ul className="list-disc md:ml-12 ml-6 space-y-2">
          <li>
            <strong>Organize with prefixes:</strong> Use folder-like structures with slashes in object
            keys (e.g., <code>images/2024/photo.jpg</code>)
          </li>
          <li>
            <strong>Secure your credentials:</strong> Never commit access keys to version control.
            Use environment variables.
          </li>
          <li>
            <strong>Delete unused objects:</strong> Clean up old files to optimize storage usage
          </li>
          <li>
            <strong>Empty buckets before deletion:</strong> Buckets must be empty before they can be
            deleted
          </li>
          <li>
            <strong>Use pre-signed URLs:</strong> For secure, temporary access without exposing
            credentials
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-700 text-start mt-4">
          Common Use Cases
        </h2>
        <div className="md:ml-6 ml-1 space-y-3">
          <div>
            <h3 className="font-semibold">1. User File Uploads</h3>
            <p className="text-sm">Store user-uploaded files like profile pictures, documents, and media.</p>
          </div>
          <div>
            <h3 className="font-semibold">2. Static Assets</h3>
            <p className="text-sm">Host images, videos, and other static content for your applications.</p>
          </div>
          <div>
            <h3 className="font-semibold">3. Backups</h3>
            <p className="text-sm">Store database backups and application snapshots securely.</p>
          </div>
          <div>
            <h3 className="font-semibold">4. Data Lake</h3>
            <p className="text-sm">Build a data lake for analytics and machine learning workflows.</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 text-start mt-4">
          Troubleshooting
        </h2>
        <div className="rounded-md border border-gray-300 my-4 bg-white">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">
            common issues
          </div>
          <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
            <code className="text-sm font-mono leading-relaxed">
              {`Issue: "Bucket already exists"
Solution: Bucket names must be globally unique. Try a different name.

Issue: "Access Denied"
Solution: Verify your access key and secret key are correct.

Issue: "Bucket not empty" (when deleting)
Solution: Delete all objects in the bucket first.

Issue: "Pre-signed URL expired"
Solution: URLs expire based on upload size. Generate a new URL.

Issue: "Invalid bucket name"
Solution: Check naming rules - lowercase, 3-63 chars, no special chars.`}
            </code>
          </pre>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 text-start mt-4">
          Pricing Information
        </h2>
        <p className="md:ml-6 ml-1">
          Object Storage is billed based on your selected storage size in GB per month. The cost is
          deducted from your SCS Coins when you enable the service. You can view your current pricing
          on the billing dashboard.
        </p>

        <div className="rounded-md border border-gray-300 my-4 bg-white">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-mono text-gray-600">
            note
          </div>
          <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto m-0">
            <code className="text-sm font-mono leading-relaxed">
              {`💡 Tips:
- Start with a smaller storage size and scale up as needed
- Monitor your usage to optimize costs
- Service auto-renews after 1 month if sufficient balance
- You can increase storage by re-enabling the service`}
            </code>
          </pre>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 text-start mt-4">
          API Reference
        </h2>
        <p className="md:ml-6 ml-1">
          For detailed API documentation including all endpoints, request/response formats, and error
          codes, refer to the complete API documentation provided with your service.
        </p>

        <h2 className="text-xl font-semibold text-gray-700 text-start mt-4">
          Support
        </h2>
        <p className="md:ml-6 ml-1">
          For any issues or questions regarding Object Storage, please contact our support team through
          the dashboard or visit our community forums.
        </p>
      </div>
    </>
  );
};

export default ObjectStorageDoc;

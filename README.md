# SCS Cloud Project

A comprehensive cloud-based streaming and content management system consisting of multiple microservices.

## Project Structure

- `scscloud/` - Frontend application built with React/TypeScript
- `scsApiServer/` - Backend API server
- `scs-hls-client/` - HLS streaming client
- `emailServer/` - Email service
- `scs-cloud-services/` - Cloud infrastructure services

## Environment Variables

### API Server (.env)

```env
# Server Configuration
PORT=8080
MONGO_URI=your_mongodb_connection_string

# JWT Tokens
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
OTP_SECRET=your_otp_secret
ACCESS_KEY_CREDENTIALS_SECRET=your_access_key_credentials_secret
SECRET_ACCESS_KEY_CREDENTIALS_SECRET=your_secret_access_key_credentials_secret

# AWS Configuration
ACCESS_KEY_ID=your_aws_access_key_id
SECRET_ACCESS_KEY=your_aws_secret_access_key
MY_BUCKET_NAME=your_s3_bucket_name

# AWS ECS Configuration
CLUSTER_ARN=your_ecs_cluster_arn
TRANSCODER_TASK_DEFINITION_ARN=your_transcoder_task_definition_arn
HOSTER_TASK_DEFINITION_ARN=your_hoster_task_definition_arn
TRANSCODER_TASK_NAME=your_transcoder_task_name
HOSTER_TASK_NAME=your_hoster_task_name
MY_SUBNET_1=your_subnet_1_id
MY_SUBNET_2=your_subnet_2_id
MY_SUBNET_3=your_subnet_3_id
MY_SECURITY_GROUP=your_security_group_id

# Message Queue Configuration
QUEUE_HOST=your_queue_host
QUEUE_USER=your_queue_username
QUEUE_PASSWORD=your_queue_password

# Payment Gateway (Cashfree)
CASHFREE_APP_KEY=your_cashfree_app_key
CASHFREE_APP_SECRET_KEY=your_cashfree_secret_key

# Service Charges
TRANSCODER_SERVICE_CHARGE=your_transcoder_service_charge
HOSTING_SERVICE_CHARGE_PER_30_DAYS=your_hosting_service_charge
```

### Transcoding Container (.env)

```env
# AWS Configuration
MY_ACCESS_KEY_ID=your_aws_access_key_id
MY_SECRET_ACCESS_KEY=your_aws_secret_access_key
USER_ACCESS_KEY_ID=your_user_aws_access_key_id
USER_SECRET_ACCESS_KEY=your_user_aws_secret_access_key

# S3 Configuration
MY_BUCKET_NAME=your_s3_bucket_name
USER_BUCKET_NAME=your_user_bucket_name
VIDEO_KEY=your_video_key
BUCKET_PATH=your_bucket_path

# User Information
USER_EMAIL=your_user_email

# Message Queue Configuration
QUEUE_HOST=your_queue_host
QUEUE_USER=your_queue_username
QUEUE_PASSWORD=your_queue_password
```

### Hosting Container (.env)

```env
# AWS Configuration
MY_ACCESS_KEY_ID=your_aws_access_key_id
MY_SECRET_ACCESS_KEY=your_aws_secret_access_key
MY_BUCKET_NAME=your_s3_bucket_name

# Web Configuration
WEB_URL=your_web_url
```

### Email Server (.env)

```env
# Email Configuration
MY_EMAIL=your_email_address
MY_PASSWORD=your_email_password
```

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd scsCloud
```

2. Set up environment variables:
   - Copy the `.env.example` files in each service directory to `.env`
   - Fill in the required environment variables as described above

3. Install dependencies for each service:
```bash
# Frontend
cd scscloud
npm install

# API Server
cd ../scsApiServer
npm install

# HLS Client
cd ../scs-hls-client
npm install

# Email Server
cd ../emailServer
npm install
```

4. Start the services:
```bash
# API Server
cd scsApiServer
npm run dev

# Frontend
cd ../scscloud
npm run dev

# HLS Client
cd ../scs-hls-client
npm run dev

# Email Server
cd ../emailServer
npm run dev
```

## Features

- User authentication and authorization
- File upload and management
- Video transcoding
- HLS streaming
- Payment integration
- Email notifications
- AWS infrastructure integration

## AWS Services Used

- ECS (Elastic Container Service)
- S3 (Simple Storage Service)
- Other AWS services as configured

## Security Notes

- Never commit `.env` files to version control
- Keep all secrets and API keys secure
- Use appropriate IAM roles and permissions
- Follow security best practices for production deployment

## Development

- Frontend is built with React, TypeScript, and Vite
- Backend uses Node.js with TypeScript
- Uses MongoDB for data storage
- Implements message queues for service communication
- Integrates with Cashfree payment gateway

## Production Deployment

1. Set up AWS infrastructure according to the architecture
2. Configure all environment variables in your deployment environment
3. Set up CI/CD pipelines (if applicable)
4. Deploy services to their respective environments
5. Configure domain names and SSL certificates
6. Set up monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Add your license information here] 
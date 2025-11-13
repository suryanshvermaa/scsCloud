# ☁️ SCS Cloud

> 🚀 **Production-ready cloud infrastructure platform** for building, deploying, and scaling modern applications with enterprise-grade services.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3.4-646cff.svg)](https://vitejs.dev/)

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Services](#-services)
- [🚀 Getting Started](#-getting-started)
- [🐳 Docker Deployment](#-docker-deployment)
- [📁 Project Structure](#-project-structure)
- [🎨 UI Components](#-ui-components)
- [🔧 Configuration](#-configuration)
- [📚 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🎯 Core Features

- 🎬 **HLS Video Transcoding** - Convert videos to adaptive streaming format (HLS)
- 🌐 **Static Website Hosting** - Deploy and host static websites with global CDN
- 📦 **Object Storage** - S3-compatible object storage with bucket management
- 🐳 **Container Service** - Deploy and manage Docker containers with Kubernetes
- 💰 **Billing Dashboard** - Real-time cost tracking and usage analytics
- 🤖 **AI Chatbot** - Integrated customer support chatbot
- 🔐 **Authentication** - Secure login/register with JWT tokens
- 🌓 **Dark Mode** - Beautiful dark/light theme support
- 📱 **Responsive Design** - Mobile-first, fully responsive UI

### 🎨 User Experience

- ⚡ Lightning-fast performance with Vite
- 🎭 Smooth animations with Tailwind CSS
- 📊 Interactive charts and visualizations
- 🔔 Real-time notifications with React Hot Toast
- 📖 Comprehensive documentation for all services
- 💳 Integrated payment gateway (Cashfree)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SCS Cloud Frontend                    │
│                  (React + TypeScript)                    │
└─────────────────────────────────────────────────────────┘
                            │
                            ├── 🎬 HLS Transcoder Service
                            ├── 🌐 Static Hosting Service
                            ├── 📦 Object Storage (S3)
                            ├── 🐳 Container Deployment (K8s)
                            ├── 💰 Billing & Analytics
                            └── 🤖 AI Chatbot
                            │
┌─────────────────────────────────────────────────────────┐
│                    Backend API Server                    │
│              (Node.js REST API - Separate)               │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend Framework
- ⚛️ **React 18.3.1** - UI library
- 📘 **TypeScript 5.2.2** - Type-safe JavaScript
- ⚡ **Vite 5.3.4** - Next-generation build tool

### Styling & UI
- 🎨 **Tailwind CSS 3.4.6** - Utility-first CSS framework
- 🎭 **Tailwind Animate** - Animation utilities
- 🎪 **Headless UI** - Unstyled accessible components
- 🎯 **Class Variance Authority** - CSS class management
- 🎨 **Lucide React** - Beautiful icons
- 🌈 **React Icons** - Icon library
- 🦸 **Hero Icons** - SVG icon set

### Routing & State
- 🛣️ **React Router DOM 6.21.3** - Client-side routing
- 🍪 **JS Cookie** - Cookie management
- 🔄 **Axios 1.7.2** - HTTP client

### Rich Content
- 📝 **React Markdown** - Markdown rendering
- 🎨 **Rehype Highlight** - Syntax highlighting
- 📖 **Remark GFM** - GitHub Flavored Markdown
- 💻 **Highlight.js** - Code highlighting

### Payment & Notifications
- 💳 **Cashfree Payments** - Payment gateway integration
- 🔔 **React Hot Toast** - Toast notifications

### Development Tools
- 🔍 **ESLint** - Code linting
- 🎯 **TypeScript ESLint** - TypeScript linting
- 📦 **PostCSS** - CSS processing
- 🔧 **Autoprefixer** - CSS vendor prefixing

---

## 📦 Services

### 🎬 HLS Video Transcoding
Convert videos to HTTP Live Streaming (HLS) format for adaptive bitrate streaming.
- ✅ Multiple quality outputs (360p, 480p, 720p, 1080p)
- ✅ Automatic thumbnail generation
- ✅ Progress tracking
- ✅ CDN delivery

**Route:** `/hls-transcoding-service`  
**Documentation:** `/hls-transcoder-docs`

---

### 🌐 Static Website Hosting
Deploy and host static websites with global CDN delivery.
- ✅ One-click deployment
- ✅ Custom domains support
- ✅ HTTPS/SSL included
- ✅ Global CDN distribution
- ✅ Automatic builds

**Route:** `/hosting-service`  
**Documentation:** `/hosting-service-docs`

---

### 📦 Object Storage
S3-compatible object storage for files, images, and backups.
- ✅ S3-compatible API
- ✅ Bucket management
- ✅ File upload/download
- ✅ Access control
- ✅ Storage analytics

**Route:** `/object-storage`  
**Documentation:** `/object-storage-docs`

---

### 🐳 Container Service
Deploy and manage Docker containers with Kubernetes orchestration.
- ✅ Docker container deployment
- ✅ Auto-scaling
- ✅ Load balancing
- ✅ Environment variables
- ✅ Custom resources (CPU/Memory)
- ✅ Custom domains

**Route:** `/container-service`  
**Documentation:** `/container-service-docs`

---

### 💰 Billing Dashboard
Real-time cost tracking and usage analytics.
- ✅ Cost breakdown by service
- ✅ Usage analytics
- ✅ Interactive charts
- ✅ Payment history
- ✅ Invoice generation

**Route:** `/amount-dashboard`

---

## 🚀 Getting Started

### Prerequisites

- 📦 Node.js 18+ 
- 📦 npm or yarn
- 🔑 API backend running (separate repository)

### Installation

1️⃣ **Clone the repository**
```bash
git clone https://github.com/suryanshvermaa/scsCloud.git
cd scscloud
```

2️⃣ **Install dependencies**
```bash
npm install
```

3️⃣ **Configure environment variables**
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:3000" > .env
```

4️⃣ **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173` 🎉

### Available Scripts

```bash
npm run dev      # 🚀 Start development server
npm run build    # 📦 Build for production
npm run preview  # 👀 Preview production build
npm run lint     # 🔍 Lint code with ESLint
```

---

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build \
  --build-arg VITE_API_URL=http://your-api-url:3000 \
  -t scs-cloud-frontend \
  .
```

### Run Container

```bash
docker run -d \
  -p 80:80 \
  --name scs-cloud \
  scs-cloud-frontend
```

### Docker Compose (Recommended)

```yaml
version: '3.8'
services:
  frontend:
    build:
      context: .
      args:
        VITE_API_URL: http://api.example.com
    ports:
      - "80:80"
    restart: unless-stopped
```

---

## 📁 Project Structure

```
scscloud/
├── 📄 index.html                 # HTML entry point
├── 📦 package.json               # Dependencies & scripts
├── ⚙️ vite.config.ts             # Vite configuration
├── 🎨 tailwind.config.js         # Tailwind CSS config
├── 📘 tsconfig.json              # TypeScript config
├── 🐳 Dockerfile                 # Docker configuration
├── 🌐 nginx.conf                 # Nginx configuration
├── 📂 public/                    # Static assets
│   └── vite.svg
├── 📂 src/
│   ├── 📄 main.tsx              # Application entry point
│   ├── 📄 App.tsx               # Root component
│   ├── 🎨 index.css             # Global styles
│   ├── 🔧 helper.tsx            # Helper functions
│   │
│   ├── 📂 assets/               # Images & media
│   │   ├── SCSCloud.png
│   │   ├── hlsTrascoder.png
│   │   ├── hostingService.png
│   │   ├── TranscodeVideo.png
│   │   └── ...
│   │
│   ├── 📂 components/           # Reusable components
│   │   ├── Header.tsx           # Navigation header
│   │   ├── Footer.tsx           # Site footer
│   │   ├── Chatbot.tsx          # AI chatbot
│   │   ├── Services.tsx         # Services showcase
│   │   ├── BillingCharts.tsx    # Billing charts
│   │   ├── Redirect.tsx         # Redirect handler
│   │   ├── 📂 layout/
│   │   │   └── SiteLayout.tsx   # Main layout wrapper
│   │   └── 📂 docs/
│   │       └── DocsLayout.tsx   # Documentation layout
│   │
│   ├── 📂 pages/                # Page components
│   │   ├── LandingPage.tsx      # Marketing landing page
│   │   ├── Home.tsx             # User dashboard
│   │   ├── Login.tsx            # Login page
│   │   ├── Register.tsx         # Registration page
│   │   ├── Profile.tsx          # User profile
│   │   ├── Pricing.tsx          # Pricing page
│   │   ├── BillingDashboard.tsx # Billing & analytics
│   │   ├── AmountScreen.tsx     # Payment screen
│   │   │
│   │   ├── 🎬 HLS Transcoder Service
│   │   ├── HLSTranscoderService.tsx
│   │   ├── HLSTranscoder.docs.tsx
│   │   │
│   │   ├── 🌐 Hosting Service
│   │   ├── HostingService.tsx
│   │   ├── StaticWebsiteHosting.docs.tsx
│   │   │
│   │   ├── 📦 Object Storage
│   │   ├── ObjectStorageDashboard.tsx
│   │   ├── ObjectStorage.docs.tsx
│   │   │
│   │   └── 🐳 Container Service
│   │       ├── ContainerServiceDashboard.tsx
│   │       └── ContainerService.docs.tsx
│   │
│   ├── 📂 routes/               # Routing configuration
│   │   └── routes.tsx           # React Router setup
│   │
│   ├── 📂 utils/                # Utility functions
│   │   ├── containerServiceApi.ts    # Container API
│   │   ├── objectStorageApi.ts       # Storage API
│   │   ├── costApi.ts                # Billing API
│   │   ├── notifier.ts               # Notifications
│   │   └── useTheme.ts               # Theme hook
│   │
│   └── 📂 docs/                 # Documentation components
│       ├── HLSTranscoder.tsx
│       ├── HostingServiceDoc.tsx
│       └── ObjectStorageDoc.tsx
```

---

## 🎨 UI Components

### Core Components

| Component | Description | Features |
|-----------|-------------|----------|
| 🎯 **Header** | Navigation bar | Responsive, dark mode, user menu |
| 🦶 **Footer** | Site footer | Links, social media, copyright |
| 🤖 **Chatbot** | AI assistant | Real-time chat, context-aware |
| 📊 **BillingCharts** | Analytics | Interactive charts, cost breakdown |
| 🏗️ **SiteLayout** | Main layout | Header, footer, content wrapper |
| 📖 **DocsLayout** | Docs layout | Sidebar navigation, content |

### Page Components

- 🏠 **LandingPage** - Marketing homepage with hero section
- 🎛️ **Home** - User dashboard with service overview
- 🔐 **Login/Register** - Authentication pages
- 👤 **Profile** - User profile management
- 💰 **Pricing** - Service pricing information
- 📊 **BillingDashboard** - Cost analytics and billing

---

## 🔧 Configuration

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: true,
    allowedHosts: [/* ngrok hosts */]
  }
})
```

### Tailwind Configuration

- 🎨 Custom color schemes
- 🌓 Dark mode support
- 📱 Responsive breakpoints
- ✨ Animation utilities
- 🎭 Custom components

### Nginx Configuration

- ⚡ Gzip compression enabled
- 📦 Static file caching (1 year)
- 🔄 SPA routing support
- 🏥 Health check endpoint
- 🚀 Optimized for production

---

## 📚 API Documentation

### Base URL
```
VITE_API_URL/api/v1
```

### Services

| Service | Endpoint | Documentation |
|---------|----------|---------------|
| 🎬 HLS Transcoder | `/transcoder` | [View Docs](/hls-transcoder-docs) |
| 🌐 Hosting | `/hosting` | [View Docs](/hosting-service-docs) |
| 📦 Object Storage | `/object-storage` | [View Docs](/object-storage-docs) |
| 🐳 Container | `/deployment` | [View Docs](/container-service-docs) |
| 💰 Billing | `/billing` | [View Docs](/amount-dashboard) |

### Authentication

All API requests require authentication via cookies:
- 🍪 `AccessCookie` - Short-lived access token (1 hour)
- 🍪 `RefreshCookie` - Long-lived refresh token (12 hours)

---

## 🌟 Key Features Details

### 🎬 HLS Video Transcoding
The HLS transcoding service converts standard video files into HTTP Live Streaming format:
- **Input Formats:** MP4, MOV, AVI, MKV
- **Output Qualities:** 360p, 480p, 720p, 1080p
- **Features:** Adaptive bitrate, thumbnail generation, progress tracking

### 🌐 Static Website Hosting
Deploy static websites with one command:
- **Supported:** React, Vue, Angular, HTML/CSS/JS
- **Features:** CDN, HTTPS, custom domains, instant deploys
- **Build Support:** Automatic builds from Git repositories

### 📦 Object Storage (S3-Compatible)
S3-compatible object storage:
- **API:** Full S3 API compatibility
- **Operations:** Upload, download, list, delete
- **Features:** Bucket management, access control, usage tracking

### 🐳 Container Service
Deploy Docker containers with ease:
- **Orchestration:** Kubernetes-based
- **Features:** Auto-scaling, load balancing, health checks
- **Resources:** Configurable CPU/Memory limits
- **Networking:** Custom domains, environment variables

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```bash
# API Configuration
VITE_API_URL=http://localhost:3000

# Payment Gateway (Cashfree)
VITE_CASHFREE_APP_ID=your_app_id_here
VITE_CASHFREE_SECRET_KEY=your_secret_key_here

# Feature Flags (Optional)
VITE_ENABLE_CHATBOT=true
VITE_ENABLE_ANALYTICS=true
```

---

## 🚦 Development

### Code Style

- ✅ TypeScript strict mode enabled
- ✅ ESLint for code quality
- ✅ Prettier for formatting (recommended)
- ✅ Component-based architecture
- ✅ Functional components with hooks

### Best Practices

1. **Components:** Use functional components with TypeScript
2. **State:** React hooks for state management
3. **Routing:** React Router for navigation
4. **Styling:** Tailwind CSS utility classes
5. **API:** Axios for HTTP requests with error handling
6. **Authentication:** JWT tokens stored in cookies

---

## 🧪 Testing

```bash
# Run tests (when configured)
npm run test

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 📈 Performance

- ⚡ **Vite HMR** - Instant hot module replacement
- 📦 **Code Splitting** - Automatic route-based splitting
- 🎨 **CSS Optimization** - PurgeCSS via Tailwind
- 🖼️ **Image Optimization** - Lazy loading, modern formats
- 🚀 **CDN** - Static assets via CDN
- 📊 **Bundle Analysis** - Optimized bundle size

---

## 🛡️ Security

- 🔐 **JWT Authentication** - Secure token-based auth
- 🍪 **HTTP-only Cookies** - XSS protection
- 🔒 **HTTPS** - SSL/TLS encryption
- 🛡️ **CORS** - Configured for API security
- 🚫 **Input Validation** - Client-side validation
- 🔑 **Environment Variables** - Sensitive data protection

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🎉 Open a Pull Request

### Development Guidelines

- Write clean, maintainable TypeScript code
- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

---

## 📞 Support

Need help? We're here for you!

- 📧 **Email:** support@scscloud.com
- 💬 **Chat:** Use the in-app chatbot
- 📖 **Documentation:** [View Docs](/)
- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/suryanshvermaa/scsCloud/issues)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- ⚛️ [React](https://reactjs.org/) - UI framework
- ⚡ [Vite](https://vitejs.dev/) - Build tool
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- 🛣️ [React Router](https://reactrouter.com/) - Routing
- 🌈 [Headless UI](https://headlessui.com/) - UI components
- 💳 [Cashfree](https://www.cashfree.com/) - Payment gateway

---

## 🚀 Roadmap

### Coming Soon

- [ ] 📱 Mobile app (React Native)
- [ ] 🔄 Real-time collaboration
- [ ] 🌍 Multi-region support
- [ ] 📊 Advanced analytics
- [ ] 🤖 AI-powered optimization
- [ ] 🔗 Webhook integrations
- [ ] 📝 API documentation portal
- [ ] 🎯 Performance monitoring

---

## 📊 Project Stats

- 🗂️ **Components:** 40+ React components
- 📄 **Pages:** 16+ unique pages
- 🎨 **UI Libraries:** Tailwind, Headless UI, Hero Icons
- 📦 **Dependencies:** 30+ production packages
- 🛠️ **Dev Tools:** TypeScript, ESLint, Vite
- 🚀 **Build Tool:** Vite (Next-generation)
- ⚡ **Performance:** Optimized for speed

---

<div align="center">

### ⭐ Star us on GitHub!

Made with ❤️ by the SCS Cloud Team

**[Website](https://scscloud.com)** • **[Documentation](/docs)** • **[GitHub](https://github.com/suryanshvermaa/scsCloud)**

</div>

---

## 🔗 Quick Links

| Resource | Link | Description |
|----------|------|-------------|
| 🏠 Homepage | [/](/) | Marketing landing page |
| 🎛️ Dashboard | [/home](/home) | User dashboard |
| 🎬 HLS Service | [/hls-transcoding-service](/hls-transcoding-service) | Video transcoding |
| 🌐 Hosting | [/hosting-service](/hosting-service) | Static hosting |
| 📦 Storage | [/object-storage](/object-storage) | Object storage |
| 🐳 Containers | [/container-service](/container-service) | Container deployment |
| 💰 Billing | [/amount-dashboard](/amount-dashboard) | Billing & analytics |
| 💵 Pricing | [/pricing](/pricing) | Service pricing |
| 👤 Profile | [/profile](/profile) | User profile |

---

**Last Updated:** November 2025  
**Version:** 0.0.0  
**Branch:** spiltJobsIntoQueue

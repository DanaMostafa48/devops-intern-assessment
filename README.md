# Todo List Application - Complete DevOps Pipeline

A full-stack Todo application built with Node.js, Express, MongoDB, and EJS templating engine. This project demonstrates a complete DevOps workflow from development to production deployment using modern tools and practices.

## 🔧 Project Overview

This project covers all stages of DevOps workflow:

- **Dockerize** the Node.js Todo app and MongoDB configuration
- **CI/CD pipeline** using GitHub Actions to build and push Docker image to Docker Hub
- **Provision a server** using Ansible and install Docker
- **Deploy the app** using Docker Compose and enable auto-updates via Watchtower
- **(Bonus)** Deploy the app on Kubernetes using ArgoCD for GitOps-style CD

## 📦 Technologies Used

| Layer | Tools / Services |
|-------|------------------|
| Source Control | Git, GitHub |
| CI/CD | GitHub Actions, Docker Hub |
| Infrastructure | AWS EC2 (Ubuntu), Ansible |
| Containers | Docker, Docker Compose, Watchtower |
| Orchestration | Kubernetes, Helm |
| CD Tool | ArgoCD |
| App & DB | Node.js Todo App, MongoDB |

## 🧱 Architecture Diagrams

### Docker + Ansible + Watchtower
```
+--------------------+
|   GitHub Repo      |
+--------------------+
         |
         | GitHub Actions
         v
+--------------------+
|  Docker Hub        |
+--------------------+
         |
         | Pull image
         v
+-----------------------------+
|     EC2 Ubuntu VM          |
|----------------------------|
| - Ansible (install Docker) |
| - Docker Compose           |
| - Watchtower (auto-update) |
+-----------------------------+
```

### Kubernetes + ArgoCD (Bonus)
```
+--------------------+
|   GitHub Repo      |
+--------------------+
         |
         | Sync via ArgoCD
         v
+-----------------------------+
|     Kubernetes Cluster      |
|-----------------------------|
| - Node.js Todo App (Pods)   |
| - MongoDB (StatefulSet)     |
| - ArgoCD (Helm installed)   |
| - Ingress + Services        |
+-----------------------------+
```

## 🚀 Project Workflow

### 🔹 Part 1 – Dockerize & GitHub Actions
- Wrote a Dockerfile to containerize the Node.js Todo app
- Added .env file to configure MongoDB URL
- Created `.github/workflows/docker.yml`:
  - Build image
  - Tag it
  - Push to Docker Hub

### 🔹 Part 2 – Ansible Provisioning
- Wrote Ansible `playbook.yml` to:
  - Install Docker
  - Add user to Docker group
  - Ensure Docker is running
- Used `inventory.yml` to target the EC2 IP

### 🔹 Part 3 – Docker Compose + Watchtower
- Created `docker-compose.yml` to run:
  - Node.js App
  - MongoDB
  - Watchtower (auto-update the image on change)
- Verified deployment via `docker ps`

### 🔹 Part 4 – Kubernetes + ArgoCD (Bonus)
- Created Kubernetes manifests:
  - App Deployment, MongoDB StatefulSet
  - Services and Ingress
- Used ArgoCD + Helm to deploy:
  ```bash
  helm install argocd argo/argo-cd --namespace argocd
  kubectl apply -f argocd-app.yml
  ```
- Synced the app from GitHub repo via ArgoCD UI

## 🚀 Features

- Create, read, update, and delete todo tasks
- Mark tasks as completed
- User authentication and registration
- Responsive web interface
- Multiple deployment options
- CI/CD ready with ArgoCD

## 📋 Prerequisites

- Node.js  
- Docker and Docker Compose
- MongoDB (or use the provided Docker setup)
- Kubernetes cluster (for K8s deployment)
- Ansible (for server automation)

## 🏗️ Project Structure

```
Todo-List-nodejs/
├── Ansible/                 # Ansible automation files
│   ├── inventory.yml       # Server inventory
│   └── playbook.yml        # Deployment playbook
├── assets/                 # Static assets
│   ├── css/               # Stylesheets
│   └── js/                # JavaScript files
├── config/                 # Configuration files
│   └── mongoose.js        # MongoDB connection
├── controllers/           # Route controllers
├── k8s/                  # Kubernetes manifests
│   ├── argocd-app.yml    # ArgoCD application
│   ├── deploy-todo-app.yml
│   ├── statefulset.yml   # MongoDB StatefulSet
│   ├── service.yml       # Application service
│   └── todo-ingress.yml  # Ingress configuration
├── models/               # MongoDB models
├── routes/               # Express routes
├── views/                # EJS templates
├── Dockerfile           # Docker image definition
├── docker-compose.yml   # Docker Compose setup
└── package.json         # Node.js dependencies
```

## 🐳 Docker Deployment

### Option 1: Docker Compose (Recommended for Development)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Todo-List-nodejs
   ```

2. **Set up environment variables:**
   ```bash
   export DOCKER_USERNAME=your_dockerhub_username
   export DOCKER_PASSWORD=your_dockerhub_password
   ```

3. **Run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - MongoDB database
   - Todo application
   - Watchtower for automatic updates

4. **Access the application:**
   - Application: http://localhost:4000
   - MongoDB: localhost:27017

### Option 2: Manual Docker Build

1. **Build the Docker image:**
   ```bash
   docker build -t todo-app .
   ```

2. **Run MongoDB:**
   ```bash
   docker run -d --name mongo -p 27017:27017 mongo
   ```

3. **Run the application:**
   ```bash
   docker run -d --name todo-app -p 4000:4000 \
     -e mongoDbUrl=mongodb://host.docker.internal:27017/todo-db \
     --link mongo todo-app
   ```

## 🤖 Ansible Deployment

### Prerequisites

1. **Install Ansible:**
   ```bash
   sudo apt update
   sudo apt install ansible
   ```

2. **Set up SSH access to your server:**
   - Ensure your SSH key is in `~/Downloads/dana.pem`
   - Update `Ansible/inventory.yml` with your server details

### Deployment Steps

1. **Create secrets file:**
   ```bash
   # Create Ansible/secrets.yml
   docker_user: your_dockerhub_username
   docker_password: your_dockerhub_password
   ```

2. **Run the Ansible playbook:**
   ```bash
   cd Ansible
   ansible-playbook -i inventory.yml playbook.yml
   ```

### What the Ansible Playbook Does

- Installs Docker and Docker Compose
- Configures user permissions
- Logs into Docker Hub
- Copies docker-compose.yml to server
- Starts the application with `docker compose up -d`

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (Minikube, k3s, or cloud provider)
- kubectl configured
- ArgoCD (optional, for GitOps)

### Option 1: Direct kubectl Deployment

1. **Start Minikube (if using local cluster):**
   ```bash
   minikube start
   ```

2. **Apply Kubernetes manifests:**
   ```bash
   kubectl apply -k k8s/
   ```

3. **Check deployment status:**
   ```bash
   kubectl get all -n todo-app
   ```

4. **Access the application:**
   ```bash
   minikube service todo-app-service -n todo-app
   ```

### Option 2: ArgoCD GitOps Deployment

1. **Install ArgoCD:**
   ```bash
   kubectl create namespace argocd
   kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
   ```

2. **Apply ArgoCD application:**
   ```bash
   kubectl apply -f k8s/argocd-app.yml
   ```

3. **Access ArgoCD UI:**
   ```bash
   kubectl port-forward svc/argocd-server -n argocd 8080:443
   ```

### Kubernetes Components

- **PersistentVolume (pv.yml)**: Storage for MongoDB
- **PersistentVolumeClaim (pvc.yml)**: Storage request
- **StatefulSet (statefulset.yml)**: MongoDB deployment
- **Deployment (dep.yml)**: Todo application deployment
- **Services (service.yml, servicedb.yml)**: Network access
- **Ingress (todo-ingress.yml)**: External access

## 🔧 Configuration

### Environment Variables

- `PORT`: Application port (default: 4000)
- `mongoDbUrl`: MongoDB connection string
- `NODE_ENV`: Environment (development/production)

### MongoDB Configuration

The application uses MongoDB for data persistence. In production, consider:
- Using managed MongoDB service (Atlas, DocumentDB)
- Setting up proper authentication
- Configuring backups and monitoring

## 📊 Monitoring and Logs

### Docker Compose
```bash
# View logs
docker-compose logs -f

# Monitor containers
docker-compose ps
```

### Kubernetes
```bash
# View application logs
kubectl logs -f deployment/todo-app -n todo-app

# Monitor resources
kubectl top pods -n todo-app
```

## 🔄 CI/CD Pipeline

### Docker Hub Integration

The project includes Watchtower for automatic updates:
- Monitors Docker Hub for new images
- Automatically updates running containers
- Runs every 30 seconds

### ArgoCD GitOps

- Automatically syncs changes from Git repository
- Self-healing capabilities
- Rollback support

 

## 📝 How to Run It

### 🐳 Local Docker Run
```bash
docker build -t my-todo-app .
docker run -p 3000:3000 --env-file .env my-todo-app
```

### 🚀 EC2 Setup via Ansible
```bash
ansible-playbook -i inventory.yml playbook.yml
```

### 🛠️ Docker Compose Deploy
```bash
docker-compose up -d
```

### ☸️ Kubernetes Deploy (Bonus)
```bash
kubectl apply -f k8s/
```

## 🛠️ Development

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start MongoDB:**
   ```bash
   docker run -d --name mongo -p 27017:27017 mongo
   ```

3. **Run the application:**
   ```bash
   npm start
   ```

### Testing

```bash
npm test
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Issues:**
   - Check if MongoDB is running
   - Verify connection string
   - Check network connectivity

2. **Docker Issues:**
   - Ensure Docker daemon is running
   - Check available disk space
   - Verify Docker Hub credentials

3. **Kubernetes Issues:**
   - Check cluster status: `kubectl get nodes`
   - Verify namespace exists: `kubectl get ns`
   - Check pod status: `kubectl get pods -n todo-app`

### Logs and Debugging

```bash
# Docker logs
docker logs todo-app

# Kubernetes logs
kubectl logs -f pod/<pod-name> -n todo-app

# Ansible verbose mode
ansible-playbook -i inventory.yml playbook.yml -vvv
```
 
## 🔗 Links

- [GitHub Repository](https://github.com/DanaMostafa48/k8s.git)
- [Docker Hub Image](https://hub.docker.com/r/danamostafa/todo-node)


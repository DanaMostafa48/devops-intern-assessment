# Todo App Helm Chart

A simple Helm chart for deploying a Todo List Node.js application with MongoDB.

## Chart Structure

```
todo-app/
├── Chart.yaml                    # Chart metadata
├── values.yaml                   # Configuration values
├── README.md                     # This file
└── templates/
    ├── deployment.yaml           # Todo app deployment
    ├── service.yaml              # Todo app service
    ├── mongodb-statefulset.yaml  # MongoDB StatefulSet
    └── mongodb-service.yaml      # MongoDB service
```

## Installation

```bash
# Install the chart
helm install todo-app ./todo-app

# Install with custom values
helm install todo-app ./todo-app --values custom-values.yaml
```

## Configuration

The following table lists the configurable parameters:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of application replicas | `2` |
| `image.repository` | Application image repository | `danamostafa/todo-node` |
| `image.tag` | Application image tag | `latest` |
| `service.type` | Service type | `LoadBalancer` |
| `service.port` | Service port | `80` |
| `service.targetPort` | Service target port | `4000` |
| `mongodb.enabled` | Enable MongoDB | `true` |
| `mongodb.image` | MongoDB image | `mongo:latest` |
| `mongodb.storageSize` | MongoDB storage size | `1Gi` |
| `app.port` | Application port | `4000` |
| `app.mongoDbUrl` | MongoDB connection URL | `mongodb://todo-app-mongo:27017/todo-db` |
| `app.nodeEnv` | Node.js environment | `production` |

## Components

- **Deployment**: Todo application with Node.js
- **StatefulSet**: MongoDB database
- **Services**: LoadBalancer for app, Headless for MongoDB
- **PersistentVolumeClaim**: MongoDB storage

## Access

After installation, access the application using:

```bash
# Get the service URL
kubectl get service todo-app

# Or use minikube service
minikube service todo-app
``` 
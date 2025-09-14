#!/bin/bash

# Docker Hub Deployment Script
# Usage: ./deploy.sh <your-dockerhub-username>

if [ $# -eq 0 ]; then
    echo "Usage: ./deploy.sh <your-dockerhub-username>"
    echo "Example: ./deploy.sh johnsmith"
    exit 1
fi

DOCKERHUB_USERNAME=$1
BACKEND_IMAGE="$DOCKERHUB_USERNAME/flask-backend"
FRONTEND_IMAGE="$DOCKERHUB_USERNAME/nodejs-frontend"
VERSION="v1.0"

echo "🚀 Starting deployment to Docker Hub..."
echo "Username: $DOCKERHUB_USERNAME"
echo "Backend Image: $BACKEND_IMAGE"
echo "Frontend Image: $FRONTEND_IMAGE"
echo ""

# Login to Docker Hub
echo "📝 Logging in to Docker Hub..."
docker login

if [ $? -ne 0 ]; then
    echo "❌ Failed to login to Docker Hub"
    exit 1
fi

# Build and push backend
echo "🔨 Building backend image..."
docker build -t $BACKEND_IMAGE:latest ./backend
docker build -t $BACKEND_IMAGE:$VERSION ./backend

echo "📤 Pushing backend image..."
docker push $BACKEND_IMAGE:latest
docker push $BACKEND_IMAGE:$VERSION

if [ $? -ne 0 ]; then
    echo "❌ Failed to push backend image"
    exit 1
fi

# Build and push frontend
echo "🔨 Building frontend image..."
docker build -t $FRONTEND_IMAGE:latest ./frontend
docker build -t $FRONTEND_IMAGE:$VERSION ./frontend

echo "📤 Pushing frontend image..."
docker push $FRONTEND_IMAGE:latest
docker push $FRONTEND_IMAGE:$VERSION

if [ $? -ne 0 ]; then
    echo "❌ Failed to push frontend image"
    exit 1
fi

echo ""
echo "✅ Successfully deployed to Docker Hub!"
echo ""
echo "Your images are now available at:"
echo "  - $BACKEND_IMAGE:latest"
echo "  - $BACKEND_IMAGE:$VERSION"
echo "  - $FRONTEND_IMAGE:latest"
echo "  - $FRONTEND_IMAGE:$VERSION"
echo ""
echo "To use these images, update your docker-compose.yml:"
echo "  backend:"
echo "    image: $BACKEND_IMAGE:latest"
echo "  frontend:"
echo "    image: $FRONTEND_IMAGE:latest"

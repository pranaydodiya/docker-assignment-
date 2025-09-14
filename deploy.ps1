# Docker Hub Deployment Script for Windows PowerShell
# Usage: .\deploy.ps1 <your-dockerhub-username>

param(
    [Parameter(Mandatory=$true)]
    [string]$DockerHubUsername
)

$BackendImage = "$DockerHubUsername/flask-backend"
$FrontendImage = "$DockerHubUsername/nodejs-frontend"
$Version = "v1.0"

Write-Host "🚀 Starting deployment to Docker Hub..." -ForegroundColor Green
Write-Host "Username: $DockerHubUsername" -ForegroundColor Cyan
Write-Host "Backend Image: $BackendImage" -ForegroundColor Cyan
Write-Host "Frontend Image: $FrontendImage" -ForegroundColor Cyan
Write-Host ""

# Login to Docker Hub
Write-Host "📝 Logging in to Docker Hub..." -ForegroundColor Yellow
docker login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to login to Docker Hub" -ForegroundColor Red
    exit 1
}

# Build and push backend
Write-Host "🔨 Building backend image..." -ForegroundColor Yellow
docker build -t "$BackendImage`:latest" ./backend
docker build -t "$BackendImage`:$Version" ./backend

Write-Host "📤 Pushing backend image..." -ForegroundColor Yellow
docker push "$BackendImage`:latest"
docker push "$BackendImage`:$Version"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push backend image" -ForegroundColor Red
    exit 1
}

# Build and push frontend
Write-Host "🔨 Building frontend image..." -ForegroundColor Yellow
docker build -t "$FrontendImage`:latest" ./frontend
docker build -t "$FrontendImage`:$Version" ./frontend

Write-Host "📤 Pushing frontend image..." -ForegroundColor Yellow
docker push "$FrontendImage`:latest"
docker push "$FrontendImage`:$Version"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push frontend image" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Successfully deployed to Docker Hub!" -ForegroundColor Green
Write-Host ""
Write-Host "Your images are now available at:" -ForegroundColor Cyan
Write-Host "  - $BackendImage`:latest" -ForegroundColor White
Write-Host "  - $BackendImage`:$Version" -ForegroundColor White
Write-Host "  - $FrontendImage`:latest" -ForegroundColor White
Write-Host "  - $FrontendImage`:$Version" -ForegroundColor White
Write-Host ""
Write-Host "To use these images, update your docker-compose.yml:" -ForegroundColor Yellow
Write-Host "  backend:" -ForegroundColor White
Write-Host "    image: $BackendImage`:latest" -ForegroundColor White
Write-Host "  frontend:" -ForegroundColor White
Write-Host "    image: $FrontendImage`:latest" -ForegroundColor White

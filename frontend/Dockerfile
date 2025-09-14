# Use Node.js 18 LTS as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Set environment variable for Flask backend URL
ENV FLASK_BACKEND_URL=http://backend:5000

# Start the application
CMD ["npm", "start"]


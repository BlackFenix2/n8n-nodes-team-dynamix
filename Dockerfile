# Use Node.js 24
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the node
RUN npm run build

# Expose n8n default port
EXPOSE 5678

# Start n8n in dev mode
CMD ["npm", "run", "dev"]

# Use a Node.js image for the development environment
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the port Vite runs on
EXPOSE 5173

# Run the Vite development server
# The '--host' flag is crucial to make the server accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]

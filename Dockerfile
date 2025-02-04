# Stage 1: Build the NestJS application
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Setup the production environment
FROM node:18-alpine AS runner

# Set the working directory inside the container
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps --only=production

# Copy the build from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Copy any environment variables or config files
COPY --from=builder /app/.env ./

# Expose the port NestJS is running on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]

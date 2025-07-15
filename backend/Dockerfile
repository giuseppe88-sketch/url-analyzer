# Use the official Golang image to create a build artifact.
FROM golang:1.22-alpine AS builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Install git and ca-certificates
RUN apk add --no-cache git ca-certificates

# Configure git to use https and never prompt for authentication
RUN git config --global url."https://github.com/".insteadOf git@github.com:
ENV GIT_TERMINAL_PROMPT=0
ENV GOPRIVATE=""

# Set Go environment variables to prefer local modules
ENV GOPROXY=direct
ENV GOSUMDB=off

# Copy everything first
COPY . .

# Generate go.sum and download dependencies
RUN go mod tidy
RUN go mod download

# Build the Go app from the cmd directory
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd

# Start a new, smaller image
FROM alpine:latest

WORKDIR /root/

# Copy the Pre-built binary file from the previous stage
COPY --from=builder /app/main .

# Copy the database migrations if they exist
COPY --from=builder /app/db/migrations ./db/migrations

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
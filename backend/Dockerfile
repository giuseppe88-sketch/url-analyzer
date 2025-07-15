# Use the official Golang image to create a build artifact.
# This is a multi-stage build, so we use a temporary image for building.
FROM golang:1.22-alpine AS builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy module files (go.sum might not exist yet)
COPY go.mod ./
COPY go.su[m] ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Tidy ensures go.mod and go.sum are accurate, downloading dependencies.
RUN go mod tidy

# Build the Go app from the new cmd directory
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd

# Start a new, smaller image
FROM alpine:latest

WORKDIR /root/

# Copy the Pre-built binary file from the previous stage
COPY --from=builder /app/main .

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
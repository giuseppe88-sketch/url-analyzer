package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/giuseppe88-sketch/url-analyzer/internal/api"
	"github.com/giuseppe88-sketch/url-analyzer/internal/db"
)

func main() {
	// Initialize the database connection and run migrations
	db.Init()

	r := gin.Default()

	// Add CORS middleware
	// This allows the frontend at localhost:3000 to make requests to the backend
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	r.Use(cors.New(config))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	// Register the new analysis endpoint
	r.POST("/analyze", api.AnalyzeURL)

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}

package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/giuseppe88-sketch/url-analyzer/internal/db"
)

func main() {
	// Initialize the database connection
	db.Init()

	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}

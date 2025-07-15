package api

// This file will contain the Gin handlers for our API endpoints.

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/giuseppe88-sketch/url-analyzer/internal/crawler"
	"github.com/giuseppe88-sketch/url-analyzer/internal/db"
)

// AnalyzeURL is the handler for the POST /analyze endpoint.
func AnalyzeURL(c *gin.Context) {
	// Define a struct to bind the incoming JSON payload
	type AnalyzeRequest struct {
		URL string `json:"url" binding:"required,url"`
	}

	var request AnalyzeRequest

	// Bind the JSON payload to the request struct
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload: " + err.Error()})
		return
	}

	// Call the crawler to analyze the page
	analysisResult, err := crawler.AnalyzePage(request.URL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze page: " + err.Error()})
		return
	}

	// Save the result to the database
	// Using Create to insert the new record.
	if err := db.DB.Create(analysisResult).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save analysis to database: " + err.Error()})
		return
	}

	// Return the successful analysis
	c.JSON(http.StatusOK, analysisResult)
}

package models

// This file will contain the GORM models for our database tables.

import "gorm.io/gorm"

// InaccessibleLink represents a link that returned an error status code.
// It belongs to a URL analysis result.
type InaccessibleLink struct {
	gorm.Model
	URLID  uint   // Foreign key to the URL struct
	Link   string `gorm:"not null" json:"url"`
	Status int    `gorm:"not null" json:"status"`
}

// URL represents the data model for a crawled web page.
type URL struct {
	gorm.Model // Includes fields like ID, CreatedAt, UpdatedAt, DeletedAt

	URL               string             `gorm:"uniqueIndex;not null"` // The URL of the page
	Title             string             // The title of the page
	HTMLVersion       string             // e.g., "HTML 5"
	HeadingsCount     string             `gorm:"type:json"` // JSON object storing counts of h1, h2, etc. e.g., {"h1": 1, "h2": 5}
	InternalLinks     int                // Count of internal links
	ExternalLinks     int                // Count of external links
	InaccessibleLinks []InaccessibleLink `gorm:"foreignKey:URLID"` // List of links returning 4xx or 5xx status
	HasLoginForm      bool               // True if a login form is detected
}

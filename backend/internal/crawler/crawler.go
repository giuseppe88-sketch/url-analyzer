package crawler

// This file will contain the logic for crawling and analyzing URLs.

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
	"sync"

	"github.com/PuerkitoBio/goquery"
	"github.com/giuseppe88-sketch/url-analyzer/internal/models"
	"golang.org/x/net/html"
)

// AnalyzePage fetches a URL and analyzes its content according to the project requirements.
func AnalyzePage(pageURL string) (*models.URL, error) {
	// Make HTTP request
	res, err := http.Get(pageURL)
	if err != nil {
		return nil, fmt.Errorf("failed to get URL: %w", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("request failed with status: %s", res.Status)
	}

	// Create a goquery document from the HTTP response
	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to parse HTML: %w", err)
	}

	// Get the base URL for resolving relative links
	baseURL, err := url.Parse(pageURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse base URL: %w", err)
	}

	// --- Data Collection ---
	title := doc.Find("title").First().Text()
	htmlVersion := getHTMLVersion(doc)
	headings, err := getHeadingsCount(doc)
	if err != nil {
		log.Printf("could not get headings count: %v", err)
	}
	internalLinks, externalLinks, inaccessibleLinks := getLinkCounts(doc, baseURL)
	hasLogin := hasLoginForm(doc)

	// Assemble the result
	analysisResult := &models.URL{
		URL:               pageURL,
		Title:             title,
		HTMLVersion:       htmlVersion,
		HeadingsCount:     headings,
		InternalLinks:     internalLinks,
		ExternalLinks:     externalLinks,
		InaccessibleLinks: inaccessibleLinks,
		HasLoginForm:      hasLogin,
	}

	return analysisResult, nil
}

// getHTMLVersion checks the DOCTYPE for a simple determination of HTML version.
func getHTMLVersion(doc *goquery.Document) string {
	if dt := doc.Find("html").Nodes[0]; dt != nil && dt.Parent != nil && dt.Parent.Type == html.DocumentNode {
		for _, attr := range dt.Attr {
			if strings.ToLower(attr.Key) == "doctype" {
				if strings.Contains(strings.ToLower(attr.Val), "html5") || (len(attr.Val) == 0) {
					return "HTML 5"
				}
			}
		}
	}
	if strings.Contains(strings.ToLower(doc.Text()), "<!doctype html>") {
		return "HTML 5"
	}
	return "Unknown"
}

// getHeadingsCount counts h1-h6 tags and returns the result as a JSON string.
func getHeadingsCount(doc *goquery.Document) (string, error) {
	counts := make(map[string]int)
	for i := 1; i <= 6; i++ {
		tag := fmt.Sprintf("h%d", i)
		counts[tag] = doc.Find(tag).Length()
	}
	jsonResult, err := json.Marshal(counts)
	if err != nil {
		return "", fmt.Errorf("failed to marshal headings count: %w", err)
	}
	return string(jsonResult), nil
}

// getLinkCounts finds all links, categorizes them, and checks their accessibility concurrently.
func getLinkCounts(doc *goquery.Document, baseURL *url.URL) (internal, external, inaccessible int) {
	var wg sync.WaitGroup
	mu := &sync.Mutex{}

	// Use a channel to limit concurrency
	concurrencyLimit := 10
	semaphore := make(chan struct{}, concurrencyLimit)

	doc.Find("a[href]").Each(func(i int, s *goquery.Selection) {
		href, exists := s.Attr("href")
		if !exists || href == "#" || strings.HasPrefix(href, "mailto:") || strings.HasPrefix(href, "tel:") {
			return
		}

		linkURL, err := baseURL.Parse(href)
		if err != nil {
			return
		}

		mu.Lock()
		if linkURL.Hostname() == baseURL.Hostname() {
			internal++
		} else {
			external++
		}
		mu.Unlock()

		wg.Add(1)
		go func(u string) {
			defer wg.Done()
			semaphore <- struct{}{}
			defer func() { <-semaphore }()

			// Use HEAD request for efficiency
			res, err := http.Head(u)
			if err != nil || (res.StatusCode >= 400 && res.StatusCode < 600) {
				mu.Lock()
				inaccessible++
				mu.Unlock()
			}
			if res != nil {
				res.Body.Close()
			}
		}(linkURL.String())
	})

	wg.Wait()
	return
}

// hasLoginForm checks for the presence of a form with a password input field.
func hasLoginForm(doc *goquery.Document) bool {
	found := false
	doc.Find("form").Each(func(i int, s *goquery.Selection) {
		if s.Find("input[type='password']").Length() > 0 {
			found = true
		}
	})
	return found
}

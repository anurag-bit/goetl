// extractor/pdf.go
// Package extractor provides functions to extract text from pdfs and aggreate data
package extractor

import (
	"strings"

	"rsc.io/pdf"
)

// ExtractPDFText extracts text from all pages of a PDF file.
func ExtractPDFText(pdfPath string) (string, error) {
	r, err := pdf.Open(pdfPath)
	if err != nil {
		return "", err
	}

	var output strings.Builder
	numPages := r.NumPage()

	for i := 1; i <= numPages; i++ {
		page := r.Page(i)
		if page.V.IsNull() {
			continue
		}

		content := extractTextFromPage(page.Content())
		output.WriteString(content + "\n")
	}

	return output.String(), nil
}

// extractTextFromPage parses and extracts text content from PDF operations.
func extractTextFromPage(content pdf.Content) string {
	var text strings.Builder

	for _, txt := range content.Text {
		text.WriteString(txt.S)
		text.WriteString(" ")
	}

	return text.String()
}

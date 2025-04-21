// Package extractor
// /pdf.go
// Package extractor provides functions to extract text from pdfs and aggreate data
package extractor

import (
	"strings"

	"rsc.io/pdf"
)

// ExtractPDFText extracts text from all pages of a PDF file.
// ExtractPDFText extracts text content from a PDF file at the given path.
// It processes all pages in the PDF and concatenates their text content,
// separated by newlines.
//
// Parameters:
//   - pdfPath: The file path to the PDF to be processed
//
// Returns:
//   - string: The extracted text content from all PDF pages
//   - error: An error if the PDF file cannot be opened or processed
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

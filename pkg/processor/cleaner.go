// processor/cleaner.go
package processor

import (
	"regexp"
	"strings"
)

// CleanText performs basic cleaning on the input text.
func CleanText(text string) string {
	// Remove extra whitespace and normalize newlines
	text = strings.TrimSpace(text)
	text = strings.ReplaceAll(text, "\t", " ")
	text = strings.ReplaceAll(text, "\r\n", "\n")
	text = strings.ReplaceAll(text, "\r", "\n")

	// Replace multiple newlines with a single newline
	reNewlines := regexp.MustCompile(`\n+`)
	text = reNewlines.ReplaceAllString(text, "\n")

	// Replace multiple spaces with single space
	reSpaces := regexp.MustCompile(`\s+`)
	text = reSpaces.ReplaceAllString(text, " ")

	return text
}

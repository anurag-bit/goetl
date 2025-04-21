// Package parser provides functions to parse and process text data.
package parser

import (
	"bufio"
	"io"
	"strings"
)

// ParseLines reads text from an io.Reader and returns a slice of lines.
func ParseLines(r io.Reader) ([]string, error) {
	var lines []string
	scanner := bufio.NewScanner(r)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	return lines, scanner.Err()
}

// SplitWords splits a string into words separated by whitespace.
func SplitWords(s string) []string {
	return strings.Fields(s)
}

// CountWords counts the number of words in a string.
func CountWords(s string) int {
	return len(SplitWords(s))
}

// FindSubstring returns true if substr is found in s.
func FindSubstring(s, substr string) bool {
	return strings.Contains(s, substr)
}

// ToUpper returns the string in uppercase.
func ToUpper(s string) string {
	return strings.ToUpper(s)
}

// ToLower returns the string in lowercase.
func ToLower(s string) string {
	return strings.ToLower(s)
}
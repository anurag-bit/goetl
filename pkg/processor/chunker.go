// processor/chunker.go
package processor

import "strings"

// ChunkText splits the text into fixed-size chunks with optional overlap.
// Example: chunkSize = 500, overlap = 50
func ChunkText(text string, chunkSize int, overlap int) []string {
	var chunks []string
	runes := []rune(text)
	length := len(runes)

	for start := 0; start < length; start += (chunkSize - overlap) {
		end := start + chunkSize
		if end > length {
			end = length
		}
		chunks = append(chunks, string(runes[start:end]))

		if end == length {
			break
		}
	}

	return chunks
}

// ChunkTextByTokens splits the text into chunks of tokens (words)
// with optional overlap in word count.
func ChunkTextByTokens(text string, tokenSize int, overlap int) []string {
	var chunks []string
	words := strings.Fields(text)
	length := len(words)

	for start := 0; start < length; start += (tokenSize - overlap) {
		end := start + tokenSize
		if end > length {
			end = length
		}
		chunk := words[start:end]
		chunks = append(chunks, strings.Join(chunk, " "))

		if end == length {
			break
		}
	}

	return chunks
}

// ChunkTextByParagraph splits text into paragraphs
// based on blank lines or newline delimiters.
func ChunkTextByParagraph(text string) []string {
	var paragraphs []string
	// Split by double newlines or something similar
	chunks := strings.Split(text, "\n\n")
	for _, p := range chunks {
		trimmed := strings.TrimSpace(p)
		if trimmed != "" {
			paragraphs = append(paragraphs, trimmed)
		}
	}
	return paragraphs
}

func ChunkTextBySearchableTokens(text string, tokenSize int, overlap int) []string {
	var chunks []string
	words := strings.Fields(text)
	length := len(words)

	for start := 0; start < length; start += (tokenSize - overlap) {
		end := start + tokenSize
		if end > length {
			end = length
		}
		chunk := strings.Join(words[start:end], " ")
		chunks = append(chunks, chunk)

		if end == length {
			break
		}
	}
	return chunks
}

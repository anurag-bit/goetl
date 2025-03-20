package main

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/anurag-bit/goetl/extractor"
	"github.com/anurag-bit/goetl/formatter"
	"github.com/anurag-bit/goetl/processor"
)

func main() {
fmt.Println("📦 LLM Dataset Prep Utility — Starter Running!")
	inputPath := "samples/demo.pdf" // Change to .txt or .pdf

	var rawText string
	var err error

	switch filepath.Ext(inputPath) {
	case ".txt":
		rawText, err = extractor.ExtractTextFile(inputPath)
	case ".pdf":
		rawText, err = extractor.ExtractPDFText(inputPath)
	default:
		fmt.Println("❌ Unsupported file type.")
		os.Exit(1)
	}

	if err != nil {
		fmt.Println("❌ Error during extraction:", err)
		return
	}

	cleanText := processor.CleanText(rawText)
	chunks := processor.ChunkTextBySearchableTokens(cleanText, 200, 20)

	err = formatter.FormatToJSONL(chunks, "output/data.jsonl", "Please summarize the following text chunk #%d.")
	if err != nil {
		fmt.Println("❌ Error writing JSONL:", err)
		return
	}

	fmt.Println("✅ Finished. JSONL file saved to: output/data.jsonl")
}

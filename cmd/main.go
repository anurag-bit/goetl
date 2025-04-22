package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/anurag-bit/goetl/pkg/extractor"
	"github.com/anurag-bit/goetl/pkg/formatter"
	"github.com/anurag-bit/goetl/pkg/load"
	"github.com/anurag-bit/goetl/pkg/parser"
	"github.com/anurag-bit/goetl/pkg/processor"
	"github.com/gin-gonic/gin"
)

const version = "1.1.0"

// printProgressBar prints a simple ASCII progress bar.
func printProgressBar(prefix string, current, total int) {
	barLen := 30
	progress := int(float64(current) / float64(total) * float64(barLen))
	if progress > barLen {
		progress = barLen
	}
	fmt.Printf("\r%s [%s%s] %d/%d", prefix,
		strings.Repeat("█", progress),
		strings.Repeat(" ", barLen-progress),
		current, total)
	if current == total {
		fmt.Println()
	}
}

// ETLRequest defines the JSON structure for API requests.
type ETLRequest struct {
	InputPath   string `json:"input"`
	OutputPath  string `json:"output"`
	ChunkSize   int    `json:"chunksize"`
	Overlap     int    `json:"overlap"`
	Format      string `json:"format"`
	DBURL       string `json:"dburl"`
	Instruction string `json:"instruction"`
	Parse       bool   `json:"parse"`
	Semantic    bool   `json:"semantic"`
	SemanticOut string `json:"semanticout"`
}

// ETLResponse defines the JSON structure for API responses.
type ETLResponse struct {
	Status     string `json:"status"`
	Message    string `json:"message"`
	OutputPath string `json:"output,omitempty"`
	Elapsed    string `json:"elapsed,omitempty"`
	Error      string `json:"error,omitempty"`
}

// etlHandler handles ETL jobs via API.
func etlHandler(c *gin.Context) {
	var req ETLRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ETLResponse{Status: "error", Message: "Invalid request", Error: err.Error()})
		return
	}
	startTime := time.Now()

	// Validate input
	if req.InputPath == "" {
		c.JSON(http.StatusBadRequest, ETLResponse{Status: "error", Message: "Input path required"})
		return
	}
	if _, err := os.Stat(req.InputPath); os.IsNotExist(err) {
		c.JSON(http.StatusBadRequest, ETLResponse{Status: "error", Message: "Input path does not exist"})
		return
	}

	// Semantic codebase analysis mode
	if req.Semantic {
		fm := load.NewFileManager(req.InputPath)
		err := fm.ProcessCodebase(req.SemanticOut)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ETLResponse{Status: "error", Message: "Semantic analysis error", Error: err.Error()})
			return
		}
		c.JSON(http.StatusOK, ETLResponse{
			Status:     "success",
			Message:    "Semantic graph saved",
			OutputPath: req.SemanticOut,
			Elapsed:    time.Since(startTime).Truncate(time.Millisecond).String(),
		})
		return
	}

	// Extraction
	ext := strings.ToLower(filepath.Ext(req.InputPath))
	var rawText string
	var err error
	switch ext {
	case ".txt":
		rawText, err = extractor.ExtractTextFile(req.InputPath)
	case ".pdf":
		rawText, err = extractor.ExtractPDFText(req.InputPath)
	default:
		c.JSON(http.StatusBadRequest, ETLResponse{Status: "error", Message: "Unsupported file type"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, ETLResponse{Status: "error", Message: "Extraction error", Error: err.Error()})
		return
	}

	// Optional: Parse and analyze
	if req.Parse {
		// No-op for API, but could return stats if needed
	}

	// Transform (Clean & Chunk)
	cleanText := processor.CleanText(rawText)
	chunks := processor.ChunkTextBySearchableTokens(cleanText, req.ChunkSize, req.Overlap)

	// Load/Format
	switch strings.ToLower(req.Format) {
	case "jsonl":
		err = formatter.FormatToJSONL(chunks, req.OutputPath, req.Instruction)
	case "csv":
		err = load.LoadToCSV(chunks, req.OutputPath)
	case "postgres":
		err = load.LoadToPostgres(chunks, req.DBURL)
	case "mysql":
		err = load.LoadToMySQL(chunks, req.DBURL)
	case "sqlite":
		err = load.LoadToSQLite(chunks, req.OutputPath)
	case "mongodb":
		err = load.LoadToMongoDB(chunks, req.DBURL)
	case "redis":
		err = load.LoadToRedis(chunks, req.DBURL)
	default:
		c.JSON(http.StatusBadRequest, ETLResponse{Status: "error", Message: "Unsupported output format"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, ETLResponse{Status: "error", Message: "Load/format error", Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, ETLResponse{
		Status:     "success",
		Message:    "ETL completed",
		OutputPath: req.OutputPath,
		Elapsed:    time.Since(startTime).Truncate(time.Millisecond).String(),
	})
}

func main() {
	// If run with no CLI flags, start API server
	if len(os.Args) == 1 {
		r := gin.Default()
		r.POST("/api/etl", etlHandler)
		r.GET("/api/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "pong", "version": version})
		})
		fmt.Printf("GOETL API server running on http://localhost:8081\n")
		r.Run(":8081")
		return
	}

	startTime := time.Now()

	// CLI flags
	inputPath := flag.String("input", "", "Path to input file (.pdf or .txt) or directory")
	outputPath := flag.String("output", "output/data.jsonl", "Output file path (JSONL/CSV/DB)")
	chunkSize := flag.Int("chunksize", 200, "Chunk size (tokens)")
	overlap := flag.Int("overlap", 20, "Token overlap between chunks")
	format := flag.String("format", "jsonl", "Output format: jsonl, csv, postgres, mysql, sqlite, mongodb, redis")
	dbURL := flag.String("dburl", "", "Database URL (for DB targets)")
	instruction := flag.String("instruction", "Please summarize the following text chunk #%d.", "Instruction template for JSONL")
	parseFlag := flag.Bool("parse", false, "Parse and analyze extracted text")
	semanticFlag := flag.Bool("semantic", false, "Analyze codebase and output semantic graph (for directories)")
	semanticOut := flag.String("semanticout", "output/semantic_graph.json", "Output path for semantic graph JSON")
	showVersion := flag.Bool("version", false, "Show version and exit")
	flag.Usage = func() {
		fmt.Fprintf(flag.CommandLine.Output(), "Usage of %s:\n", os.Args[0])
		flag.PrintDefaults()
		fmt.Println("\nExamples:")
		fmt.Println("  goetl -input samples/demo.pdf -output output/data.jsonl -format jsonl")
		fmt.Println("  goetl -input mydir/ -semantic -semanticout output/graph.json")
	}
	flag.Parse()

	if *showVersion {
		fmt.Printf("GOETL Utility version %s\n", version)
		return
	}

	fmt.Println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
	fmt.Println("📦 LLM Dataset Prep Utility — ETL CLI")
	fmt.Printf("Version: %s\n", version)
	fmt.Println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

	if *inputPath == "" {
		fmt.Println("❌ Please provide an input file or directory with -input flag.")
		flag.Usage()
		os.Exit(2)
	}

	// Validate input file/directory existence
	if _, err := os.Stat(*inputPath); os.IsNotExist(err) {
		fmt.Printf("❌ Input path does not exist: %s\n", *inputPath)
		os.Exit(2)
	}

	// Semantic codebase analysis mode
	if *semanticFlag {
		fmt.Println("🔎 [1/1] Semantic codebase analysis enabled.")
		fm := load.NewFileManager(*inputPath)
		fmt.Printf("    Analyzing directory: %s\n", *inputPath)
		err := fm.ProcessCodebase(*semanticOut)
		if err != nil {
			fmt.Printf("❌ Semantic analysis error: %v\n", err)
			os.Exit(3)
		}
		fmt.Printf("✅ Semantic graph saved to: %s\n", *semanticOut)
		fmt.Printf("⏱️  Elapsed: %s\n", time.Since(startTime).Truncate(time.Millisecond))
		return
	}

	fmt.Printf("Input: %s\nOutput: %s\nFormat: %s\n", *inputPath, *outputPath, *format)
	fmt.Println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

	// Extraction
	fmt.Println("🔍 [1/4] Extracting text...")
	var rawText string
	var err error
	ext := strings.ToLower(filepath.Ext(*inputPath))
	switch ext {
	case ".txt":
		rawText, err = extractor.ExtractTextFile(*inputPath)
	case ".pdf":
		rawText, err = extractor.ExtractPDFText(*inputPath)
	default:
		fmt.Printf("❌ Unsupported file type: %s\n", ext)
		os.Exit(4)
	}
	if err != nil {
		fmt.Printf("❌ Error during extraction: %v\n", err)
		os.Exit(4)
	}
	fmt.Printf("    Extracted %d bytes.\n", len(rawText))
	printProgressBar("Extracting", 1, 1)

	// Optional: Parse and analyze extracted text using parser modules
	if *parseFlag {
		fmt.Println("🔎 [2/4] Parsing and analyzing extracted text...")
		var lines []string
		var wordCount int
		if ext == ".txt" {
			lines = parser.SplitWords(rawText)
			wordCount = parser.CountWords(rawText)
		} else if ext == ".pdf" {
			lines = parser.SplitWords(rawText)
			wordCount = parser.CountWords(rawText)
		}
		printProgressBar("Parsing", 1, 1)
		fmt.Printf("    Line count: %d\n", len(strings.Split(rawText, "\n")))
		fmt.Printf("    Word count: %d\n", wordCount)
		if len(lines) > 0 {
			fmt.Printf("    First word (upper): %s\n", parser.ToUpper(lines[0]))
			fmt.Printf("    First word (lower): %s\n", parser.ToLower(lines[0]))
		}
	}

	// Transform (Clean & Chunk)
	fmt.Println("🧹 [3/4] Cleaning and chunking text...")
	cleanText := processor.CleanText(rawText)
	chunks := processor.ChunkTextBySearchableTokens(cleanText, *chunkSize, *overlap)
	fmt.Printf("    Cleaned text length: %d bytes\n", len(cleanText))
	fmt.Printf("    Chunks created: %d (chunk size: %d, overlap: %d)\n", len(chunks), *chunkSize, *overlap)
	for i := 1; i <= len(chunks); i++ {
		printProgressBar("Chunking", i, len(chunks))
		time.Sleep(5 * time.Millisecond) // Simulate progress for UX
	}

	// Load/Format
	fmt.Println("💾 [4/4] Formatting and loading output...")
	switch strings.ToLower(*format) {
	case "jsonl":
		for i := 1; i <= len(chunks); i++ {
			printProgressBar("Writing JSONL", i, len(chunks))
			// Simulate progress; actual writing is done in one call below
			time.Sleep(2 * time.Millisecond)
		}
		err = formatter.FormatToJSONL(chunks, *outputPath, *instruction)
	case "csv":
		for i := 1; i <= len(chunks); i++ {
			printProgressBar("Writing CSV", i, len(chunks))
			time.Sleep(2 * time.Millisecond)
		}
		err = load.LoadToCSV(chunks, *outputPath)
	case "postgres":
		for i := 1; i <= len(chunks); i++ {
			printProgressBar("Writing Postgres", i, len(chunks))
			time.Sleep(2 * time.Millisecond)
		}
		err = load.LoadToPostgres(chunks, *dbURL)
	case "mysql":
		for i := 1; i <= len(chunks); i++ {
			printProgressBar("Writing MySQL", i, len(chunks))
			time.Sleep(2 * time.Millisecond)
		}
		err = load.LoadToMySQL(chunks, *dbURL)
	case "sqlite":
		for i := 1; i <= len(chunks); i++ {
			printProgressBar("Writing SQLite", i, len(chunks))
			time.Sleep(2 * time.Millisecond)
		}
		err = load.LoadToSQLite(chunks, *outputPath)
	case "mongodb":
		for i := 1; i <= len(chunks); i++ {
			printProgressBar("Writing MongoDB", i, len(chunks))
			time.Sleep(2 * time.Millisecond)
		}
		err = load.LoadToMongoDB(chunks, *dbURL)
	case "redis":
		for i := 1; i <= len(chunks); i++ {
			printProgressBar("Writing Redis", i, len(chunks))
			time.Sleep(2 * time.Millisecond)
		}
		err = load.LoadToRedis(chunks, *dbURL)
	default:
		fmt.Printf("❌ Unsupported output format: %s\n", *format)
		os.Exit(5)
	}
	if err != nil {
		fmt.Printf("❌ Error during load/format: %v\n", err)
		os.Exit(5)
	}

	fmt.Printf("✅ Finished. Data saved to: %s\n", *outputPath)
	fmt.Printf("⏱️  Elapsed: %s\n", time.Since(startTime).Truncate(time.Millisecond))
	fmt.Println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
}

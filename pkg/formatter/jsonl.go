// formatter/jsonl.go
// Package formatter provides functions to format data into  jsonl 
package formatter

import (
	"encoding/json"
	"fmt"
	"os"
)

type InstructionSample struct {
	Instruction string `json:"instruction"`
	Input       string `json:"input"`
	Output      string `json:"output"`
}

// FormatToJSONL writes chunked data to a JSONL file with instruction structure
// FormatToJSONL formats a slice of text chunks into a JSONL (JSON Lines) file.
// Each chunk is wrapped in an InstructionSample structure that includes:
// - An instruction string formatted with the chunk's index
// - An empty input field
// - The chunk content as output
//
// Parameters:
//   - chunks: A slice of strings to be formatted as individual JSONL entries
//   - outputPath: Path where the JSONL file will be written
//   - instructionTemplate: A format string where %d will be replaced with the chunk index (1-based)
//
// Returns:
//   - error: If file creation, JSON marshaling, or file writing operations fail
//
// The function writes each JSON object on a separate line in the output file.
func FormatToJSONL(chunks []string, outputPath string, instructionTemplate string) error {
	file, err := os.Create(outputPath)
	if err != nil {
		return err
	}
	defer file.Close()

	for i, chunk := range chunks {
		sample := InstructionSample{
			Instruction: fmt.Sprintf(instructionTemplate, i+1),
			Input:       "",
			Output:      chunk,
		}

		jsonLine, err := json.Marshal(sample)
		if err != nil {
			return err
		}

		_, err = file.Write(jsonLine)
		if err != nil {
			return err
		}
		_, err = file.Write([]byte("\n"))
		if err != nil {
			return err
		}
	}

	return nil
}

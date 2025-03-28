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

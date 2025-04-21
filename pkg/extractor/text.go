// extractor/text.go
// Package extractor provides functions to extract text from txt files and aggregate data
package extractor

import (
    "io/ioutil"
)

// ExtractTextFile reads the content of a text file at the specified path and returns it as a string.
// It opens and reads the entire file into memory, so it should be used cautiously with large files.
//
// Parameters:
//   - filePath: The path to the text file to be read.
//
// Returns:
//   - string: The content of the file as a string.
//   - error: An error object that indicates if there was a problem reading the file.
//            Returns nil if successful.
func ExtractTextFile(filePath string) (string, error) {
    data, err := ioutil.ReadFile(filePath)
    if err != nil {
        return "", err
    }
    return string(data), nil
}

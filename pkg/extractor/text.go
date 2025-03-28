// extractor/text.go
// Package extractor provides functions to extract text from txt files and aggregate data
package extractor

import (
    "io/ioutil"
)

func ExtractTextFile(filePath string) (string, error) {
    data, err := ioutil.ReadFile(filePath)
    if err != nil {
        return "", err
    }
    return string(data), nil
}

// extractor/text.go
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

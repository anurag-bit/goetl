package parser

import (
	"bytes"
	"io"
	"os"

	"github.com/ledongthuc/pdf"
)

// PDFParser parses PDF files and extracts text content.
type PDFParser struct{}

// NewPDFParser creates a new PDFParser instance.
func NewPDFParser() *PDFParser {
	return &PDFParser{}
}

// ParseFile extracts all text from a PDF file at the given path.
func (p *PDFParser) ParseFile(path string) (string, error) {
	f, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer f.Close()
	return p.Parse(f)
}

// Parse extracts all text from a PDF file provided as an io.Reader.
func (p *PDFParser) Parse(r io.Reader) (string, error) {
	// Read all bytes from the reader
	buf := new(bytes.Buffer)
	_, err := buf.ReadFrom(r)
	if err != nil {
		return "", err
	}

	// Load PDF from bytes
	pdfReader, err := pdf.NewReader(bytes.NewReader(buf.Bytes()), int64(buf.Len()))
	if err != nil {
		return "", err
	}

	var text bytes.Buffer
	numPages := pdfReader.NumPage()
	for i := 1; i <= numPages; i++ {
		page := pdfReader.Page(i)
		if page.V.IsNull() {
			continue
		}
		content, err := page.GetPlainText(nil)
		if err != nil {
			return "", err
		}
		text.WriteString(content)
	}
	return text.String(), nil
}
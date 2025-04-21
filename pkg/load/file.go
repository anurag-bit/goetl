package load

import (
	"encoding/json"
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

// FileManager manages loading, saving, and analyzing files and directories.
type FileManager struct {
	FilePath     string
	FileName     string
	FileType     string
	FileTypeName string
	FileTypeID   string
}

// NewFileManager creates a new FileManager for a given file path.
func NewFileManager(path string) *FileManager {
	fileName := filepath.Base(path)
	fileType := filepath.Ext(path)
	fileTypeName := strings.TrimPrefix(fileType, ".")
	fileTypeID := fmt.Sprintf("%s-%d", fileTypeName, len(fileName))

	return &FileManager{
		FilePath:     path,
		FileName:     fileName,
		FileType:     fileType,
		FileTypeName: fileTypeName,
		FileTypeID:   fileTypeID,
	}
}

// GetFileName returns the file name.
func (fm *FileManager) GetFileName() string {
	return fm.FileName
}

// GetFileType returns the file type.
func (fm *FileManager) GetFileType() string {
	return fm.FileType
}

// GetFileTypeID returns the file type ID.
func (fm *FileManager) GetFileTypeID() string {
	return fm.FileTypeID
}

// LoadFile loads the content of a file.
func (fm *FileManager) LoadFile() ([]byte, error) {
	return os.ReadFile(fm.FilePath)
}

// SaveFile saves data to the file.
func (fm *FileManager) SaveFile(data []byte) error {
	return os.WriteFile(fm.FilePath, data, 0644)
}

// ListFiles lists all files in a directory recursively.
func (fm *FileManager) ListFiles() ([]string, error) {
	var files []string
	err := filepath.WalkDir(fm.FilePath, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() {
			files = append(files, path)
		}
		return nil
	})
	return files, err
}

// SemanticNode represents a node in the semantic graph.
type SemanticNode struct {
	Name     string         `json:"name"`
	Type     string         `json:"type"`
	Children []*SemanticNode `json:"children,omitempty"`
}

// SemanticGraph represents the semantic structure of a codebase.
type SemanticGraph struct {
	Root *SemanticNode `json:"root"`
}

// BuildSemanticGraph builds a semantic graph for a Go codebase.
func (fm *FileManager) BuildSemanticGraph() (*SemanticGraph, error) {
	rootNode := &SemanticNode{Name: filepath.Base(fm.FilePath), Type: "directory"}
	err := fm.buildGraphRecursive(fm.FilePath, rootNode)
	if err != nil {
		return nil, err
	}
	return &SemanticGraph{Root: rootNode}, nil
}

func (fm *FileManager) buildGraphRecursive(path string, parent *SemanticNode) error {
	entries, err := os.ReadDir(path)
	if err != nil {
		return err
	}
	for _, entry := range entries {
		node := &SemanticNode{Name: entry.Name()}
		fullPath := filepath.Join(path, entry.Name())
		if entry.IsDir() {
			node.Type = "directory"
			err := fm.buildGraphRecursive(fullPath, node)
			if err != nil {
				return err
			}
		} else if strings.HasSuffix(entry.Name(), ".go") {
			node.Type = "go-file"
			structs, funcs, _ := parseGoFile(fullPath)
			for _, s := range structs {
				node.Children = append(node.Children, &SemanticNode{Name: s, Type: "struct"})
			}
			for _, f := range funcs {
				node.Children = append(node.Children, &SemanticNode{Name: f, Type: "function"})
			}
		} else {
			node.Type = "file"
		}
		parent.Children = append(parent.Children, node)
	}
	return nil
}

// parseGoFile parses a Go file and returns struct and function names.
func parseGoFile(path string) (structs []string, funcs []string, err error) {
	fset := token.NewFileSet()
	node, err := parser.ParseFile(fset, path, nil, parser.AllErrors)
	if err != nil {
		return
	}
	for _, decl := range node.Decls {
		switch d := decl.(type) {
		case *ast.GenDecl:
			if d.Tok == token.TYPE {
				for _, spec := range d.Specs {
					if typeSpec, ok := spec.(*ast.TypeSpec); ok {
						if _, ok := typeSpec.Type.(*ast.StructType); ok {
							structs = append(structs, typeSpec.Name.Name)
						}
					}
				}
			}
		case *ast.FuncDecl:
			funcs = append(funcs, d.Name.Name)
		}
	}
	return
}

// SaveSemanticGraph saves the semantic graph to a JSON file.
func (fm *FileManager) SaveSemanticGraph(graph *SemanticGraph, outPath string) error {
	data, err := json.MarshalIndent(graph, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(outPath, data, 0644)
}

// ProcessCodebase builds and saves the semantic graph for a codebase directory.
func (fm *FileManager) ProcessCodebase(outputPath string) error {
	graph, err := fm.BuildSemanticGraph()
	if err != nil {
		return err
	}
	return fm.SaveSemanticGraph(graph, outputPath)
}
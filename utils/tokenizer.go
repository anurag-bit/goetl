package utils

import (
	"bufio"
	"errors"
	"fmt"
	"os"
	"strings"
)

// Pair represents a pair of tokens.
type Pair struct {
	First  string
	Second string
}

// Tokenizer holds BPE merges and configuration.
type Tokenizer struct {
	Merges         []Pair
	WordBoundary   string
	MergeDict      map[Pair]struct{}
}

// NewTokenizer creates a new Tokenizer with optional merges and word boundary marker.
func NewTokenizer(merges []Pair, wordBoundary string) *Tokenizer {
	mergeDict := make(map[Pair]struct{})
	for _, m := range merges {
		mergeDict[m] = struct{}{}
	}
	return &Tokenizer{
		Merges:       merges,
		WordBoundary: wordBoundary,
		MergeDict:    mergeDict,
	}
}

// InitialTokens splits text into tokens with word boundary marker.
func (t *Tokenizer) InitialTokens(text string) [][]string {
	words := strings.Fields(text)
	tokens := [][]string{}
	for _, word := range words {
		chunks := strings.Split(word, "")
		chunks = append(chunks, t.WordBoundary)
		tokens = append(tokens, chunks)
	}
	return tokens
}

// GetPairFrequencies counts frequencies of adjacent token pairs.
func (t *Tokenizer) GetPairFrequencies(tokens [][]string) map[Pair]int {
	pairs := make(map[Pair]int)
	for _, word := range tokens {
		for i := 0; i < len(word)-1; i++ {
			p := Pair{word[i], word[i+1]}
			pairs[p]++
		}
	}
	return pairs
}

// MergePair merges the specified pair in all tokens.
func (t *Tokenizer) MergePair(tokens [][]string, pairToMerge Pair) [][]string {
	merged := [][]string{}
	for _, word := range tokens {
		newWord := []string{}
		i := 0
		for i < len(word) {
			if i < len(word)-1 && word[i] == pairToMerge.First && word[i+1] == pairToMerge.Second {
				newWord = append(newWord, word[i]+word[i+1])
				i += 2
			} else {
				newWord = append(newWord, word[i])
				i++
			}
		}
		merged = append(merged, newWord)
	}
	return merged
}

// TrainBPE trains a BPE tokenizer on the given corpus.
func TrainBPE(corpus string, numMerges int, wordBoundary string) ([]Pair, error) {
	if corpus == "" || numMerges <= 0 {
		return nil, errors.New("invalid corpus or numMerges")
	}
	t := NewTokenizer(nil, wordBoundary)
	tokens := t.InitialTokens(corpus)
	merges := []Pair{}
	for i := 0; i < numMerges; i++ {
		pairFreqs := t.GetPairFrequencies(tokens)
		if len(pairFreqs) == 0 {
			break
		}
		var bestPair Pair
		maxFreq := -1
		for pair, freq := range pairFreqs {
			if freq > maxFreq {
				bestPair = pair
				maxFreq = freq
			}
		}
		tokens = t.MergePair(tokens, bestPair)
		merges = append(merges, bestPair)
	}
	return merges, nil
}

// ApplyBPE encodes text using the learned merges.
func (t *Tokenizer) ApplyBPE(text string) []string {
	tokens := t.InitialTokens(text)
	for _, pair := range t.Merges {
		tokens = t.MergePair(tokens, pair)
	}
	encoded := []string{}
	for _, word := range tokens {
		cleaned := []string{}
		for _, token := range word {
			if token != t.WordBoundary {
				cleaned = append(cleaned, token)
			}
		}
		encoded = append(encoded, strings.Join(cleaned, " "))
	}
	return encoded
}

// DecodeBPE reconstructs original words from BPE-encoded tokens.
func (t *Tokenizer) DecodeBPE(encoded []string) []string {
	decoded := []string{}
	for _, word := range encoded {
		decoded = append(decoded, strings.ReplaceAll(strings.ReplaceAll(word, " ", ""), t.WordBoundary, ""))
	}
	return decoded
}

// SaveMerges saves merges to a file.
func SaveMerges(filename string, merges []Pair) error {
	f, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer f.Close()
	w := bufio.NewWriter(f)
	for _, m := range merges {
		fmt.Fprintf(w, "%s %s\n", m.First, m.Second)
	}
	return w.Flush()
}

// LoadMerges loads merges from a file.
func LoadMerges(filename string) ([]Pair, error) {
	f, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	var merges []Pair
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		parts := strings.Fields(scanner.Text())
		if len(parts) == 2 {
			merges = append(merges, Pair{parts[0], parts[1]})
		}
	}
	return merges, scanner.Err()
}

// Example usage and test
func main() {
	corpus := "low lower lowest low lower lowest"
	merges, err := TrainBPE(corpus, 10, "</w>")
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	tokenizer := NewTokenizer(merges, "</w>")

	fmt.Println("Learned merges:")
	for i, m := range merges {
		fmt.Printf("%d: (%s %s)\n", i+1, m.First, m.Second)
	}

	text := "lowest low"
	encoded := tokenizer.ApplyBPE(text)
	fmt.Println("\nEncoded output:")
	for _, word := range encoded {
		fmt.Println(word)
	}

	decoded := tokenizer.DecodeBPE(encoded)
	fmt.Println("\nDecoded output:")
	for _, word := range decoded {
		fmt.Println(word)
	}
}

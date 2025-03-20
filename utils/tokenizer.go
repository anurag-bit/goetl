package utils



import (
	"fmt"
	"strings"
)

type Pair struct {
	First  string
	Second string
}

func initialTokens(text string) [][]string {
	words := strings.Fields(text)
	tokens := [][]string{}

	for _, word := range words {
		chunks := strings.Split(word, "")
		chunks = append(chunks, "</w>")
		tokens = append(tokens, chunks)
	}

	return tokens
}

func getPairFrequencies(tokens [][]string) map[Pair]int {
	pairs := make(map[Pair]int)

	for _, word := range tokens {
		for i := 0; i < len(word)-1; i++ {
			p := Pair{word[i], word[i+1]}
			pairs[p]++
		}
	}

	return pairs
}

func mergePair(tokens [][]string, pairToMerge Pair) [][]string {
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

func trainBPE(corpus string, numMerges int) []Pair {
	tokens := initialTokens(corpus)
	merges := []Pair{}

	for i := 0; i < numMerges; i++ {
		pairFreqs := getPairFrequencies(tokens)
		if len(pairFreqs) == 0 {
			break
		}

		// Find most frequent pair
		var bestPair Pair
		maxFreq := -1
		for pair, freq := range pairFreqs {
			if freq > maxFreq {
				bestPair = pair
				maxFreq = freq
			}
		}

		tokens = mergePair(tokens, bestPair)
		merges = append(merges, bestPair)
	}

	return merges
}

func applyBPE(text string, merges []Pair) []string {
	tokens := initialTokens(text)

	for _, pair := range merges {
		tokens = mergePair(tokens, pair)
	}

	encoded := []string{}
	for _, word := range tokens {
		cleaned := []string{}
		for _, token := range word {
			if token != "</w>" {
				cleaned = append(cleaned, token)
			}
		}
		encoded = append(encoded, strings.Join(cleaned, " "))
	}

	return encoded
}
func main() {
	corpus := "low lower lowest low lower lowest"
	merges := trainBPE(corpus, 10)

	fmt.Println("Learned merges:")
	for i, m := range merges {
		fmt.Printf("%d: (%s %s)\n", i+1, m.First, m.Second)
	}

	text := "lowest low"
	encoded := applyBPE(text, merges)
	fmt.Println("\nEncoded output:")
	for _, word := range encoded {
		fmt.Println(word)
	}
}

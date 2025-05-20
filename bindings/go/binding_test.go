package tree_sitter_we_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_we "github.com/b1nus/tree-sitter-we/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_we.Language())
	if language == nil {
		t.Errorf("Error loading We grammar")
	}
}

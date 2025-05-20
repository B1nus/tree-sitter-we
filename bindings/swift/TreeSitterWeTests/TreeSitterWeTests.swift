import XCTest
import SwiftTreeSitter
import TreeSitterWe

final class TreeSitterWeTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_we())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading We grammar")
    }
}

(function name: (name) @function)
(function parameter: (name) @variable.parameter)

(binding variable: (name) @variable)
(assignment variable: (path) @variable)

[
 "repeat"
 "break"
 "continue"
 "return"
 "variant"
 "record"
 "if"
 "else"
 "use"
 "as"
 "function"
 "and"
 "or"
 "not"
 "xor"
 "true"
 "false"
 "e"
 "pi"
] @keyword

[
  "s8"
  "s16"
  "s32"
  "s64"
  "u8"
  "u16"
  "u32"
  "u64"
  "bool"
] @type.builtin

(repeat label: (name) @label)
(break label: (name) @label)
(continue label: (name) @label)

(record name: (name) @type field: (name) @property)
(variant  name: (name) @type field: (name) @property)

(record_literal record: (path) @type field: (name) @property)
(variant_literal variant: (path) @type field: (name) @property)

(path  field: (name) @property)

(call function: (path field: (name) @function.call))

(use alias: (name) @variable)

(unary_expression operator: [("+") ("-")] @operator)
(unary_expression operator: "not" @keyword.operator)
(binary_expression operator: [("+") ("-") ("*") ("/") ("^") ("%") ] @operator)
(binary_expression operator: [("and") ("or") ("xor")] @keyword.operator)

(expression variable: (path) @variable)

[ (integer) (float) (char) ] @number
(escape_sequence) @constant.builtin
(string) @string
(comment) @comment
(type) @type

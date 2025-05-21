(function_definition name: (name) @function)
(parameter_list parameter: (name) @variable.parameter)

(ignorable_variable variable: (namespaced_name) @variable)
(variable_binding variable: (name) @variable)

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
] @keyword

(repeat name: (name) @label)

(break name: (name) @label)
(continue name: (name) @label)

(record name: (name) @type field: (name) @property)
(variant  name: (name) @type field: (name) @property)

(record_literal name: (namespaced_name) @type field: (name) @property)
(variant_literal name: (namespaced_name) @type field: (name) @property)

(call name: (namespaced_name) @function)

(use alias: (name) @variable)

(unary_expression operator: [("+") ("-")] @operator)
(unary_expression operator: "not" @keyword.operator)
(binary_expression operator: [("+") ("-") ("*") ("/") ("^") ("%") ] @operator)
(binary_expression operator: [("and") ("or") ("xor")] @keyword.operator)

(expression variable: (namespaced_name) @variable)

(type name: (namespaced_name) @type)

[ (integer) (float) (char) ] @number
[ (true) (false) ] @keyword
(escape_sequence) @constant.builtin
(string) @string
(comment) @comment
(type) @type

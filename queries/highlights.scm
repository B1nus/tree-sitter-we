(function name: (name) @function)
(function parameter: (name) @variable.parameter)
;
; (ignorable_variable variable: (namespaced_name) @variable)
(binding variable: (name) @variable)
;
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
;
; (repeat name: (name) @label)
;
; (break name: (name) @label)
; (continue name: (name) @label)
;
; (record name: (name) @type field: (name) @property)
; (variant  name: (name) @type field: (name) @property)
;
; (record_literal name: (namespaced_name) @type field: (name) @property)
; (variant_literal name: (namespaced_name) @type field: (name) @property)
;
(call path: (path) @function)
;
; (use alias: (name) @variable)
;
; (unary_expression operator: [("+") ("-")] @operator)
; (unary_expression operator: "not" @keyword.operator)
; (binary_expression operator: [("+") ("-") ("*") ("/") ("^") ("%") ] @operator)
; (binary_expression operator: [("and") ("or") ("xor")] @keyword.operator)
;
(expression variable: (path) @variable)
;
; (type name: (namespaced_name) @type)
;
[ (integer) (float) (char) ] @number
(escape_sequence) @constant.builtin
(string) @string
(comment) @comment
(type) @type

(function_definition keyword: ("function") @keyword name: (name) @function)
(parameter_list parameter: (name) @variable.parameter)

(comment) @comment
(type) @type

(ignorable_variable name: (name) @variable)
(variable_binding name: (name) @variable)

(repeat keyword: ("repeat") @keyword)
(repeat keyword: ("repeat") @keyword name: (name) @label)

(break keyword: ("break") @keyword name: (name) @label)
(continue keyword: ("continue") @keyword name: (name) @label)

(return keyword: ("return") @keyword)

(record keyword: ("record") @keyword name: (name) @type field: (name) @property)
(variant keyword: ("variant") @keyword name: (name) @type field: (name) @property)

(record_literal name: (name) @type field: (name) @property)
(variant_literal name: (name) @type field: (name) @property)

(if keyword: ("if") @keyword)
(else keyword: ("else") @keyword)

(call name: (name) @function)

(use keyword: ("use") @keyword)
(use keyword: ("as") @keyword alias: (name) @variable)

(unary_expression operator: [("+") ("-")] @operator)
(unary_expression operator: "not" @keyword.operator)
(binary_expression operator: [("+") ("-") ("*") ("/") ("^") ("%") ] @operator)
(binary_expression operator: [("and") ("or") ("xor")] @keyword.operator)

[ (integer) (float) (char) ] @number
[ (true) (false) ] @keyword
(escape_sequence) @constant.builtin
(string) @string


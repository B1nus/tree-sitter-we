(function_definition keyword: ("function") @keyword name: (name) @function)
(parameter_list parameter: (name) @variable.parameter)

(comment) @comment
(type) @type

(ignorable_variable name: (name) @variable)
(variable_binding name: (name) @variable)

(repeat keyword: ("repeat"))
(repeat name: (name) @label)

(break keyword: ("break") @keyword name: (name) @label)
(continue keyword: ("continue") @keyword name: (name) @label)

(return keyword: ("return") @keyword)

(record keyword: ("record") @keyword name: (name) @type field: (name) @property)
(variant keyword: ("variant") @keyword name: (name) @type field: (name) @property)

(if keyword: ("if") @keyword)
(else keyword: ("else") @keyword)

(call name: (name) @function)

(use keyword: ("use") @keyword)
(use keyword: ("as") @keyword alias: (name) @variable)

[ (integer) (float) ] @number
[ (true) (false) ] @constant
(string) @string


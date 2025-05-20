/**
 * @file A simple typed and compiled language, trying to emulate the ease of use of lua and python without a garbage collector.
 * @author Lini <119787571+B1nus@users.noreply.github.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "we",

  extras: $ => [
    /\s/,
    $.comment
  ],

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => repeat($._statement),

    _statement: $ => choice(
      $.function_definition,
      $.variable_binding,
      $.variable_assignment,
      $.call,
      $.if,
      $.else,
      $.use,
      $.repeat,
      $.break,
      $.continue,
      $.return,
      $.record,
      $.variant,
      $.comment,
    ),

    break: $ => seq(field("keyword", 'break'), field("name", optional($.name)), $.newline),

    continue: $ => seq(field("keyword", 'continue'), field("name", optional($.name)), $.newline),

    return: $ => seq(field("keyword", 'return'),
      optional(seq(
        $.expression,
        repeat(seq(',', $.expression))
      )),
      $.newline,
    ),

    record: $ => prec.right(seq(
      field("keyword", 'record'),
      field("name", $.name),
      $.newline,
      repeat1(seq(field("field", $.name), $.type, $.newline))
    )),

    variant: $ => prec.right(seq(
      field("keyword", 'variant'),
      field("name", $.name),
      $.newline,
      repeat1(seq(field("field", $.name), optional($.type), $.newline))
    )),

    call: $ => seq(
      field("name", $.name),
      '(',
      optional(
        seq(
          $.expression,
          repeat(seq(
            ',',
            $.expression
          ))
        )
      ),
      ')',
      $.newline
    ),

    if: $ => seq(
      field("keyword", 'if'),
      $.expression,
      $.newline,
    ),

    else: $ => prec.right(seq(
      field("keyword", 'else'),
      optional($.if),
    )),

    use: $ => seq(
      field("keyword", 'use'),
      field("path", $.string),
      optional(seq(
        field("keyword", 'as'),
        field("alias", $.name)
      )),
      $.newline,
    ),

    repeat: $ => seq(
      field("keyword", 'repeat'),
      optional(field("name", $.name)),
      optional($.expression),
      $.newline,
    ),

    function_definition: $ => prec.left(seq(
      field("keyword", 'function'),
      field("name", $.name),
      field("parameters", $.parameter_list),
      field("result", optional($.result_list)),
    )),

    parameter_list: $ => seq(
      '(',
      optional(seq(
        field("parameter", $.name),
        $.type,
        repeat(seq(',', 
          field("parameter", $.name),
          $.type))
      )),
      ')'
    ),

    result_list: $ => seq(
      $.type,
      repeat(seq(',', $.type)),
    ),

    variable_binding: $ => prec.left(seq(
      field("name", $.name),
      $.type,
      repeat(seq(
        field("name", $.name),
        $.type,
      )),
      $.newline,
    )),

    variable_assignment: $ => prec.left(seq(
      seq(
        $.ignorable_variable,
        repeat(seq(
          ',',
          $.ignorable_variable,
        ))
      ),
      seq('=', $.expression),
      $.newline,
    )),

    ignorable_variable: $ => choice(
      '_',
      seq(
        field("name", $.name),
        optional($.type)
      )
    ),

    expression: $ => choice(
      $.float,
      $.integer,
      $.true,
      $.false,
      $.string,
    ),

    char: $ => seq(
      "'",
      choice(
        /[^'\\]/,
        seq("\\", /./)
      ),
      "'"
    ),

    string: $ => seq(
      '"',
      repeat(choice(
        /[^"\\]/,
        seq("\\", /./)
      )),
      '"',
    ),

    newline: $ => seq(optional('\r'), '\n'),

    float: $ => choice(
      /0x[0-9a-fA-F]+.[0-9a-fA-F]+/,
      /[0-9]+.[0-9]+/,
    ),

    integer: $ => choice(
      /0x[0-9a-fA-F]+/,
      /[0-9]+/,
    ),

    name: $ => /([a-z]([a-z_0-9]*[a-z0-9])?)/,

    type: $ => prec.right(choice(
      's8',
      's16',
      's32',
      's64',
      'u8',
      'u16',
      'u32',
      'u64',
      'f32',
      'f64',
      'bool',
      seq('[', $.type, ']'),
      seq('{', $.type, ':', $.type, '}'),
      seq('{', $.type, '}'),
      seq('?', $.type),
      seq($.type, '!', $.type),
      $.name,
    )),

    true: _ => "true",
    false: _ => "false",

    comment: $ => token(seq('//', /.*/))
  }
});

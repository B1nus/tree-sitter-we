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

  externals: $ => [
    $._newline,
    $._indent,
    $._dedent,
    ']',
    ')',
    '}',
    'except',
  ],

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => repeat($.statement),

    statement: $ => choice(
      $.function_definition,
      $.variable_binding,
      $.variable_assignment,
      seq($.call, $._newline),
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

    break: $ => seq(field("keyword", 'break'), field("name", optional($.name)), $._newline),

    continue: $ => seq(field("keyword", 'continue'), field("name", optional($.name)), $._newline),

    return: $ => seq(field("keyword", 'return'),
      optional(seq(
        $.expression,
        repeat(seq(',', $.expression))
      )),
      $._newline,
    ),

    record: $ => seq(
      field("keyword", 'record'),
      field("name", $.name),
      $._indent,
      seq(
        field("field", $.name),
        $.type,
        repeat(seq($._newline, field("field", $.name), $.type))
      ),
      $._dedent,
    ),

    variant: $ => seq(
      field("keyword", 'variant'),
      field("name", $.name),
      $._indent,
      seq(
        field("field", $.name),
        optional($.type),
        repeat(seq($._newline, field("field", $.name), optional($.type)))
      ),
      $._dedent,
    ),

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
    ),

    if: $ => seq(
      field("keyword", 'if'),
      $.expression,
      $._newline,
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
      $._newline,
    ),

    repeat: $ => seq(
      field("keyword", 'repeat'),
      field("name", optional($.name)),
      optional($.expression),
      $._newline,
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
      $._newline,
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
      $._newline,
    )),

    ignorable_variable: $ => choice(
      '_',
      seq(
        field("name", $.name),
        optional($.type)
      )
    ),

    expression: $ => choice(
      $.unary_expression,
      $.binary_expression,
      $.float,
      $.integer,
      $.true,
      $.false,
      $.string,
      $.char,
      $.list,
      $.set,
      $.map,
      $.record_literal,
      $.variant_literal,
      $.call,
    ),

    list: $ => seq(
      '[',
      optional(seq($.expression, repeat(seq(',', $.expression)))),
      ']'
    ),

    set: $ => seq(
      '{',
      seq($.expression, repeat(seq(',', $.expression))),
      '}'
    ),

    map: $ => seq(
      '{',
      seq($.expression, ':', $.expression, repeat(seq(',', $.expression, ':', $.expression))),
      '}'
    ),

    record_literal: $ => prec.left(seq(
      field("name", $.name),
      $._indent,
      seq(
        field("field", $.name),
        $.expression,
        repeat(seq(
          $._newline,
          field("field", $.name),
          $.expression,
        ))
      ),
      $._dedent,
    )),

    variant_literal: $ => prec.left(seq(field("name", $.name), '.', field("field", $.name), $.expression)),

    unary_expression: $ => prec.left(
      12,
      seq(
        field("operator", choice("not", "+", "-")),
        $.expression
      )
    ),

    binary_expression: $ => choice(
      prec.left(3, seq($.expression, field("operator", choice("and", "xor", "or")), $.expression)),
      prec.left(4, seq($.expression, field("operator", choice("==", "!=", "<", "<=", ">", ">=")), $.expression)),
      prec.left(9, seq($.expression, field("operator", choice("+", "-")), $.expression)),
      prec.left(10, seq($.expression, field("operator", choice("*", "/", "%")), $.expression)),
      prec.left(11, seq($.expression, field("operator", "^"), $.expression)),
    ),

    char: $ => seq("'", optional(choice($.escape_sequence, /./)), "'"),

    string: $ => seq(
      '"',
      repeat(choice($.escape_sequence, /[^"\\]+/)),
      token.immediate('"')
    ),

    escape_sequence: (_) => token.immediate(seq(
      "\\",
      choice(
        /[^xu\n]/,
        /u[0-9a-fA-F]{4}/,
        /u\{[0-9a-fA-F]+\}/,
        /x[0-9a-fA-F]{2}/
      )
    )),

    float: $ => choice(
      /0x[0-9a-fA-F]+.[0-9a-fA-F]+/,
      /0o[0-7]+.[0-7]+/,
      /0b[0-1]+.[0-1]+/,
      /[0-9]+.[0-9]+/,
    ),

    integer: $ => choice(
      /0x[0-9a-fA-F]+/,
      /0o[0-7]+/,
      /0b[0-1]+/,
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

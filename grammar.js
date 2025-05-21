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

  conflicts: $ => [
    [$.expression, $.record_literal],
  ],

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => repeat($.statement),

    statement: $ => choice(
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

    block: $ => seq($._indent, repeat($.statement), $._dedent),

    break: $ => seq('break', field("name", optional($.name)), $._newline),

    continue: $ => seq('continue', field("name", optional($.name)), $._newline),

    return: $ => seq('return',
      optional(seq(
        $.expression,
        repeat(seq(',', $.expression))
      )),
      $._newline,
    ),

    record: $ => seq(
      'record',
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
      'variant',
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
      field("name", $.namespaced_name),
      token.immediate('('),
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
      'if',
      $.expression,
      $.block,
    ),

    else: $ => prec.right(seq(
      'else',
      optional(seq('if', $.expression)),
      $.block,
    )),

    use: $ => seq(
      'use',
      field("path", $.string),
      optional(seq(
        'as',
        field("alias", $.name)
      )),
      $._newline,
    ),

    repeat: $ => seq(
      optional(seq(field("name", $.name), ":")),
      'repeat',
      optional($.expression),
      $.block,
    ),

    function_definition: $ => prec.left(seq(
      'function',
      field("name", $.name),
      field("parameters", $.parameter_list),
      field("result", optional($.result_list)),
      optional($.block),
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
      field("variable", $.name),
      $.type,
      repeat(seq(
        field("variable", $.name),
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
        field("variable", $.namespaced_name),
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
      field("variable", $.namespaced_name),
      seq('(', $.expression, ')'),
    ),

    list: $ => seq(
      '[',
      seq($.expression, repeat(seq(',', $.expression))),
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
      field("name", $.namespaced_name),
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

    variant_literal: $ => prec.left(seq(field("name", $.namespaced_name), '.', field("field", $.name), $.expression)),

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

    namespaced_name: $ => prec.left(choice(
      field("name", $.name),
      seq($.namespaced_name, '.', field("field", $.name)),
    )),

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
      field("name", $.namespaced_name),
    )),

    true: _ => "true",
    false: _ => "false",

    comment: $ => token(seq('//', /.*/))
  }
});

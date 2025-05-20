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

  conflicts: $ => [
    [$.variable_declaration, $.variable_assignment],
  ],

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => repeat($._statement),

    _statement: $ => choice(
      $.function_definition,
      $.variable_declaration,
      $.variable_assignment,
      $.comment,
    ),

    function_definition: $ => seq(
      'function',
      field("name", $.name),
      field("parameters", $.parameter_list),
      field("result", optional($.result_list)),
    ),

    parameter_list: $ => seq(
      '(',
      optional(seq(
        $.name,
        $.type,
        repeat(seq(',', $.name, $.type))
      )),
      ')'
    ),

    result_list: $ => $.type_list,

    type_list: $ => seq(
      $.type,
      repeat(seq(',', $.type)),
    ),

    variable_declaration: $ => seq(
      $.name,
      $.type,
      repeat(seq(
        ',',
        $.name,
        $.type,
      )),
      $.newline,
    ),

    variable_assignment: $ => seq(seq(
      $.name,
      optional($.type),
      repeat(seq(
        ',',
        $.name,
        optional($.type),
      ))),
      '=',
      $._expression,
      $.newline,
    ),

    _expression: $ => '1',

    newline: $ => seq(optional('\r'), '\n'),

    name: $ => /([a-z]([a-z_]+[a-z])?)/,

    type: $ => choice(
      's64',
      'f64',
    ),

    comment: $ => token(seq(
      '//', /.*/,
    ))
  }
});

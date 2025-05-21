/**
 * @file A simple typed and compiled language, trying to emulate the ease of use of lua and python without a garbage collector.
 * @author Lini <119787571+B1nus@users.noreply.github.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

list = function (rule, separator) {
	return seq(rule, repeat(seq(separator, rule)), optional(separator));
};

module.exports = grammar({
	name: "we",

	word: ($) => $.name,

	extras: ($) => [/\s/, $.comment],

	externals: ($) => [
		$._newline,
		$._indent,
		$._dedent,
	],

	rules: {
		source_file: ($) => repeat($.statement),

		statement: ($) =>
			choice(
        $.function,
				$.assignment,
				$.binding,
				$.call,
				$.if,
				$.use,
				$.repeat,
				$.break,
				$.continue,
				$.return,
				$.record,
				$.variant,
			),

		name: ($) => /([a-z]([a-z_0-9]*[a-z0-9])?)/,
		path: ($) => prec.left(list($.name, ".")),
		comment: ($) => token(seq("#", /.*/)),

		block: ($) => seq($._indent, repeat($.statement), $._dedent),

		break: ($) => seq("break", field("label", optional($.name)), $._newline),

		continue: ($) =>
			seq("continue", field("label", optional($.name)), $._newline),

		return: ($) => seq("return", optional(list($.expression, ",")), $._newline),

    function: ($) =>
      seq(
        "function",
        field("name", $.name),
        token.immediate('('),
        list(seq(field("parameter", $.name), $.type), ','),
        ')',
        list($.type, ','),
        $.block,
      ),

		record: ($) =>
			seq(
				"record",
				field("name", $.name),
				$._indent,
				list(seq(field("field", $.name), $.type), $._newline),
        repeat(choice($.function, $.variant, $.record)),
				$._dedent,
			),

		variant: ($) =>
			seq(
				"variant",
				field("name", $.name),
				$._indent,
				list(seq(field("field", $.name), optional($.type)), $._newline),
        repeat(choice($.function, $.variant, $.record)),
				$._dedent,
			),

		call: ($) =>
			seq(
				field("path", $.path),
				token.immediate("("),
				optional(list($.expression, ",")),
				")",
			),

		if: ($) =>
			seq(
				"if",
				$.expression,
				$.block,
				optional(seq("else", choice($.if, $.block))),
			),

		use: ($) =>
			seq(
				"use",
				$.string,
				optional(seq("as", field("alias", $.name))),
				$._newline,
			),

		repeat: ($) =>
			seq(
				"repeat",
				optional($.expression),
				optional(seq("as", field("label", $.name))),
				$.block,
			),

		binding: ($) =>
			prec(2, seq(list(field("variable", $.name), ","), $.type, $._newline)),

		assignment: ($) =>
			seq(
				list(seq(choice("_", $.path), optional($.type)), ","),
				"=",
        list($.expression, ','),
				$._newline,
			),

		expression: ($) =>
			prec(2, choice(
				$.float,
				$.integer,
				"true",
				"false",
        "e",
        "pi",
				$.string,
				$.char,
				$.unary_expression,
				$.binary_expression,
				seq("[", list($.expression, ","), "]"),
				seq("{", list($.expression, ","), "}"),
				seq("{", list(seq($.expression, ":", $.expression), ","), "}"),
				$.record_literal,
				$.variant_literal,
				$.call,
				field("variable", $.path),
				seq("(", $.expression, ")"),
			)),

		record_literal: ($) =>
			seq(
				field("record", $.path),
				$._indent,
				list(seq(field("field", $.name), $.expression), $._newline),
				$._dedent,
			),

		variant_literal: ($) =>
			prec.left(seq(
				optional(field("variant", $.path)),
				".",
				field("field", $.name),
				optional($.expression),
			)),

		unary_expression: ($) =>
			prec.left(
				6,
				seq(field("operator", choice("not", "+", "-")), $.expression),
			),

		binary_expression: ($) => {
			const table = [
				[1, choice("and", "xor", "or")],
				[2, choice("==", "!=", "<", "<=", ">", ">=")],
				[3, choice("+", "-")],
        [4, choice("<<", ">>")],
				[5, choice("*", "/", "%", "^")],
			];

			return choice(
				...table.map(([num, rule]) =>
					prec.left(
						num,
						seq($.expression, field("operator", rule), $.expression),
					),
				),
			);
		},

		char: ($) => seq("'", optional(choice($.escape_sequence, /./)), "'"),

		string: ($) =>
			seq(
				'"',
				repeat(choice($.escape_sequence, /[^"\\]+/)),
				token.immediate('"'),
			),

		escape_sequence: (_) =>
			token.immediate(
				seq(
					"\\",
					choice(
						/[^xu\n]/,
						/u[0-9a-fA-F]{4}/,
						/u\{[0-9a-fA-F]+\}/,
						/x[0-9a-fA-F]{2}/,
					),
				),
			),

		float: ($) =>
			choice(
				/0x[0-9a-fA-F]+.[0-9a-fA-F]+/,
				/0o[0-7]+.[0-7]+/,
				/0b[0-1]+.[0-1]+/,
				/[0-9]+.[0-9]+/,
			),

		integer: ($) => choice(/0x[0-9a-fA-F]+/, /0o[0-7]+/, /0b[0-1]+/, /[0-9]+/),

		path: ($) =>
			prec(1, choice(
				field("name", $.name),
				seq($.path, ".", field("field", $.name)),
			)),

		type: ($) =>
			prec.left(2, choice(
				"s8",
				"s16",
				"s32",
				"s64",
				"u8",
				"u16",
				"u32",
				"u64",
				"f32",
				"f64",
				"bool",
				seq("[", $.type, "]"),
				seq("{", $.type, ":", $.type, "}"),
				seq("{", $.type, "}"),
				field("variable", $.path),
				$.function_type,
			)),

		function_type: ($) =>
			prec.left(seq("function", token.immediate("("), list($.type, ","), ")", list($.type, ","))),
	},
});

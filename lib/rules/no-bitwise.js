/**
 * @fileoverview Rule to flag bitwise identifiers
 * @author Nicholas C. Zakas
 */

"use strict";

//
// Set of bitwise operators.
//
var BITWISE_OPERATORS = [
    "^", "|", "&", "<<", ">>", ">>>",
    "^=", "|=", "&=", "<<=", ">>=", ">>>=",
    "~"
];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var options = context.options[0] || {};
    var allowed = options.allow || [];

    /**
     * Reports an unexpected use of a bitwise operator.
     * @param   {ASTNode} node Node which contains the bitwise operator.
     * @returns {void}
     */
    function report(node) {
        context.report(node, "Unexpected use of '{{operator}}'.", { operator: node.operator });
    }

    /**
     * Checks if the given node has a bitwise operator.
     * @param   {ASTNode} node The node to check.
     * @returns {boolean} Whether or not the node has a bitwise operator.
     */
    function hasBitwiseOperator(node) {
        return BITWISE_OPERATORS.indexOf(node.operator) !== -1;
    }

    /**
     * Checks if exceptions were provided, e.g. `{ allow: ['~', '|'] }`.
     * @param   {ASTNode} node The node to check.
     * @returns {boolean} Whether or not the node has a bitwise operator.
     */
    function allowedOperator(node) {
        return allowed.indexOf(node.operator) !== -1;
    }

    /**
     * Report if the given node contains a bitwise operator.
     * @param   {ASTNode} node The node to check.
     * @returns {void}
     */
    function checkNodeForBitwiseOperator(node) {
        if (hasBitwiseOperator(node) && !allowedOperator(node)) {
            report(node);
        }
    }

    return {
        "AssignmentExpression": checkNodeForBitwiseOperator,
        "BinaryExpression": checkNodeForBitwiseOperator,
        "UnaryExpression": checkNodeForBitwiseOperator
    };

};

module.exports.schema = [
    {
        "type": "object",
        "properties": {
            "allow": {
                "type": "array",
                "items": {
                    "enum": BITWISE_OPERATORS
                },
                "uniqueItems": true
            }
        },
        "additionalProperties": false
    }
];

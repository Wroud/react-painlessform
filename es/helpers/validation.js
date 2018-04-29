"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("../tools");
function mergeValidations(validation, context) {
    return {
        isValid: !(!context.isValid || !validation.isValid),
        errors: tools_1.mergeFormErrors(context.errors, validation.errors),
        scope: [...context.scope, ...validation.scope],
    };
}
exports.mergeValidations = mergeValidations;

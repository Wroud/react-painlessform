"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("../tools");
function mergeValidations(validation, context) {
    return {
        isValid: !(!context.isValid || !validation.isValid),
        errors: tools_1.mergeFormErrors(context.errors, validation.errors),
        scope: context.scope.concat(validation.scope),
    };
}
exports.mergeValidations = mergeValidations;
function getProps(getters) {
    var props = {};
    Object.keys(getters).forEach(function (key) {
        props[key] = typeof getters[key] === "function" ? getters[key]() : getters[key];
    });
    return props;
}
exports.getProps = getProps;
//# sourceMappingURL=validation.js.map
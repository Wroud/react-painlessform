"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepEqual = require("deep-equal");
const util_1 = require("util");
const Path_1 = require("../Path");
const tools_1 = require("../tools");
/**
 * Update `model` with [[Field]] `state`
 * @param value [[Field]]s state
 * @param state [[Form]] `model`
 */
function updateFieldsState(value, state, fields) {
    const newModel = Object.assign({}, state);
    fields.forEach(selector => {
        const prevValue = selector.getValue(newModel, {});
        selector.setValueImmutable(newModel, Object.assign({}, prevValue, value));
    });
    return newModel;
}
exports.updateFieldsState = updateFieldsState;
/**
 * Sets `values` to `model`
 * @param values fields values
 * @param model [[Form]] `model`
 */
function mergeModels(value, model) {
    const newValue = Object.assign({}, model);
    tools_1.deepExtend(newValue, value);
    return { model: newValue, isChanged: deepEqual(model, newValue) };
}
exports.mergeModels = mergeModels;
exports.isField = (state, from, scope) => (field, strict) => {
    return from.selector.includes(scope.join(Path_1.Path.fromSelector(field)), strict);
};
function getInputValue(value, type, forwardedValue, multiple) {
    if (/radio/.test(type) || /checkbox/.test(type)) {
        return forwardedValue || "";
    }
    const castValue = /number|range/.test(type) && isNaN(value)
        ? 0
        : value === undefined
            ? ""
            : value;
    return forwardedValue !== undefined
        ? forwardedValue
        : castValue;
}
exports.getInputValue = getInputValue;
function getInputChecked(value, type, forwardedValue) {
    if (/checkbox/.test(type)) {
        return util_1.isArray(value) && forwardedValue
            ? value.indexOf(forwardedValue) !== -1
            : value;
    }
    if (/radio/.test(type)) {
        return value === forwardedValue;
    }
    return undefined;
}
exports.getInputChecked = getInputChecked;
function getDefaultValue(value, type, multiple) {
    if (/checkbox/.test(type)) {
        return value || false;
    }
    if (/number|range/.test(type)) {
        return value === undefined ? 0 : value;
    }
    return value !== undefined
        ? value
        : multiple
            ? []
            : "";
}
exports.getDefaultValue = getDefaultValue;
//# sourceMappingURL=form.js.map
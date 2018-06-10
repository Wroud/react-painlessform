"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepEqual = require("deep-equal");
const util_1 = require("util");
const tools_1 = require("../tools");
function updateFieldsState(value, model, fields) {
    const newModel = Object.assign({}, model);
    fields.forEach(selector => {
        const prevValue = tools_1.fromProxy(tools_1.autoCreateProxy(newModel), selector, {});
        tools_1.setPathValue(Object.assign({}, prevValue, value), selector, newModel);
    });
    return newModel;
}
exports.updateFieldsState = updateFieldsState;
function setModelValues(value, model, rest) {
    const newValue = Object.assign({}, model);
    tools_1.deepExtend(newValue, value);
    return { model: newValue, isChanged: deepEqual(model, newValue) };
}
exports.setModelValues = setModelValues;
function updateField(field, index, value, state) {
    return { field, index, value, state };
}
exports.updateField = updateField;
exports.isField = (state, from, scope) => {
    const path = tools_1.getPath(from.selector, state);
    return (field, strict) => {
        return strict
            ? path === tools_1.getPath(scope(field), state)
            : path.includes(tools_1.getPath(scope(field), state));
    };
};
function getInputValue(value, forwardedValue, type, multiple) {
    if (/radio/.test(type) || /checkbox/.test(type)) {
        return forwardedValue;
    }
    const defaultValue = multiple ? [] : "";
    const castValue = /number|range/.test(type) && isNaN(value)
        ? 0
        : value;
    return forwardedValue !== undefined
        ? forwardedValue
        : castValue;
}
exports.getInputValue = getInputValue;
function getInputChecked(value, forwardedValue, type) {
    if (/checkbox/.test(type)) {
        return util_1.isArray(value) ? value.indexOf(forwardedValue) !== -1 : value;
    }
    if (/radio/.test(type)) {
        return value === forwardedValue;
    }
    return undefined;
}
exports.getInputChecked = getInputChecked;
function getValue(value, type, forwardedValue, multiple) {
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
exports.getValue = getValue;

"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Update `model` with [[Field]] `state`
 * @param value [[Field]]s state
 * @param model [[Form]] `model`
 */
function updateModelFields(value, model) {
    var newModel = __assign({}, model);
    for (var _i = 0, _a = Object.keys(model); _i < _a.length; _i++) {
        var key = _a[_i];
        newModel[key] = __assign({}, newModel[key], value);
    }
    return newModel;
}
exports.updateModelFields = updateModelFields;
/**
 * Update `model` with `values`
 * @param values fields values
 * @param model [[Form]] `model`
 */
function updateModel(values, model) {
    var newModel = __assign({}, model);
    for (var _i = 0, _a = Object.keys(values); _i < _a.length; _i++) {
        var key = _a[_i];
        newModel[key] = __assign({}, (newModel[key] || {}), { value: values[key] });
    }
    return newModel;
}
exports.updateModel = updateModel;
/**
 * Sets all fields `value` to empty string and `isChanged` & `isVisited` to `false`
 * @param model [[Form]] `model`
 */
function resetModel(model) {
    var newModel = {};
    for (var _i = 0, _a = Object.keys(model); _i < _a.length; _i++) {
        var key = _a[_i];
        newModel = __assign({}, newModel, (_b = {}, _b[key] = {
            value: "",
            isChanged: false,
            isVisited: false,
        }, _b));
    }
    return newModel;
    var _b;
}
exports.resetModel = resetModel;
/**
 * Selects `values` from [[Form]] `model`
 * @param model [[Form]] `model`
 */
function getValuesFromModel(model) {
    var values = {};
    if (typeof model !== "object") {
        return undefined;
    }
    for (var _i = 0, _a = Object.keys(model); _i < _a.length; _i++) {
        var key = _a[_i];
        values[key] = model[key].value;
    }
    return values;
}
exports.getValuesFromModel = getValuesFromModel;
//# sourceMappingURL=form.js.map
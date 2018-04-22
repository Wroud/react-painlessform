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
function updateModelFields(value, model) {
    var newModel = __assign({}, model);
    for (var _i = 0, _a = Object.keys(model); _i < _a.length; _i++) {
        var key = _a[_i];
        newModel[key] = __assign({}, newModel[key], value);
    }
    return newModel;
}
exports.updateModelFields = updateModelFields;
function updateModel(values, model) {
    var newModel = __assign({}, model);
    for (var _i = 0, _a = Object.keys(values); _i < _a.length; _i++) {
        var key = _a[_i];
        newModel[key] = __assign({}, (newModel[key] || {}), { value: values[key] });
    }
    return newModel;
}
exports.updateModel = updateModel;
function resetModel(model) {
    var newModel = __assign({}, model);
    for (var _i = 0, _a = Object.keys(model); _i < _a.length; _i++) {
        var key = _a[_i];
        newModel[key] = {
            value: "",
            isChanged: false,
            isVisited: false,
        };
    }
    return newModel;
}
exports.resetModel = resetModel;
function getValuesFromModel(model) {
    var values = {};
    for (var _i = 0, _a = Object.keys(model); _i < _a.length; _i++) {
        var key = _a[_i];
        values[key] = model[key].value;
    }
    return values;
}
exports.getValuesFromModel = getValuesFromModel;
//# sourceMappingURL=form.js.map
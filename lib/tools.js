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
function isArrayEqual(array0, array1) {
    if (array0 !== array1
        && (array0 === undefined || array1 === undefined)) {
        return false;
    }
    if (array0 !== undefined
        && array1 !== undefined
        && array0.length !== array1.length) {
        return false;
    }
    for (var index in array0) {
        if (array0[index] !== array1[index]) {
            return false;
        }
    }
    return true;
}
exports.isArrayEqual = isArrayEqual;
function mergeFormErrors(one, two) {
    var merged = one || {};
    if (two) {
        for (var _i = 0, _a = Object.keys(two); _i < _a.length; _i++) {
            var key = _a[_i];
            if (two[key].length > 0) {
                merged = __assign({}, merged, (_b = {}, _b[key] = (merged[key] || []).concat(two[key]), _b));
            }
        }
    }
    return merged;
    var _b;
}
exports.mergeFormErrors = mergeFormErrors;
//# sourceMappingURL=tools.js.map
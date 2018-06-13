"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shallowequal = require("shallowequal");
const util_1 = require("util");
const tools_1 = require("../tools");
function castValue(to, value, type, forwardedValue, multiple) {
    let result = value;
    if (/checkbox/.test(type)) {
        result = value === true;
        if (forwardedValue !== undefined && multiple) {
            let castTo = Array.isArray(to) ? [...to] : [];
            const indexOf = castTo.indexOf(forwardedValue);
            if (indexOf === -1 && result) {
                castTo = [...castTo, forwardedValue];
            }
            else if (indexOf > -1 && !result) {
                castTo.splice(indexOf, 1);
            }
            result = castTo;
        }
        return result;
    }
    if (/radio/.test(type)) {
        return result !== undefined
            ? result
            : to === forwardedValue
                ? ""
                : to;
    }
    return result;
}
exports.castValue = castValue;
function isDiffEqual(diff, model) {
    let equal = true;
    if (diff.value !== undefined) {
        const value = diff.selector.getValue(model.values);
        equal = equal && isValueEqual(value, diff.value);
    }
    if (diff.state !== undefined) {
        const state = diff.selector.getValue(model.state);
        equal = equal && shallowequal(state, diff.state);
    }
    return equal;
}
exports.isDiffEqual = isDiffEqual;
function isValueEqual(diff, value) {
    if (!diff || !value || !util_1.isArray(diff)) {
        return diff === value;
    }
    return tools_1.isArrayEqual(diff, value);
}
exports.isValueEqual = isValueEqual;
//# sourceMappingURL=field.js.map
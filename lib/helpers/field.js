"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shallowequal = require("shallowequal");
const util_1 = require("util");
const tools_1 = require("../tools");
function castValue(to, value, forwardedValue, type, multiple) {
    let result = value;
    if (/checkbox/.test(type)) {
        result = (value === true);
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
    const value = tools_1.fromProxy(tools_1.autoCreateProxy(model.values), diff.selector);
    const state = tools_1.fromProxy(tools_1.autoCreateProxy(model.state), diff.selector);
    return isValueEqual(value, diff.value)
        && shallowequal(state, diff.state);
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepEqual = require("deep-equal");
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
        const prevState = selector.getValue(newModel, {});
        selector.setValueImmutable(newModel, Object.assign({}, prevState, value));
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
    const newModel = Object.assign({}, model);
    tools_1.deepExtend(newModel, value);
    return { model: newModel, isChanged: deepEqual(model, newModel) };
}
exports.mergeModels = mergeModels;
exports.isField = (state, from, scope) => (field, strict) => {
    return from.selector.includes(scope.join(Path_1.Path.fromSelector(field)), strict);
};
//# sourceMappingURL=form.js.map
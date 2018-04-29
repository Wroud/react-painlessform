"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mergeModels(value, model) {
    const newModel = Object.assign({}, model);
    for (const key of Object.keys(value)) {
        newModel[key] = Object.assign({}, (newModel[key] || {}), value[key]);
    }
    return newModel;
}
exports.mergeModels = mergeModels;
function updateModelFields(value, model) {
    const newModel = Object.assign({}, model);
    for (const key of Object.keys(model)) {
        newModel[key] = Object.assign({}, newModel[key], value);
    }
    return newModel;
}
exports.updateModelFields = updateModelFields;
function updateModel(values, model, rest) {
    const newModel = Object.assign({}, model);
    for (const key of Object.keys(values)) {
        newModel[key] = Object.assign({}, (newModel[key] || {}), { value: values[key] }, (rest || {}));
    }
    return newModel;
}
exports.updateModel = updateModel;
function resetModel(model) {
    let newModel = {};
    for (const key of Object.keys(model)) {
        newModel = Object.assign({}, newModel, { [key]: {
                value: "",
                isChanged: false,
                isVisited: false,
            } });
    }
    return newModel;
}
exports.resetModel = resetModel;
function getValuesFromModel(model) {
    const values = {};
    if (typeof model !== "object") {
        return undefined;
    }
    for (const key of Object.keys(model)) {
        values[key] = model[key].value;
    }
    return values;
}
exports.getValuesFromModel = getValuesFromModel;

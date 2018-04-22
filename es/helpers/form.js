"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function updateModelFields(value, model) {
    const newModel = Object.assign({}, model);
    for (const key of Object.keys(model)) {
        newModel[key] = Object.assign({}, newModel[key], value);
    }
    return newModel;
}
exports.updateModelFields = updateModelFields;
function updateModel(values, model) {
    const newModel = Object.assign({}, model);
    for (const key of Object.keys(values)) {
        newModel[key] = Object.assign({}, (newModel[key] || {}), { value: values[key] });
    }
    return newModel;
}
exports.updateModel = updateModel;
function resetModel(model) {
    const newModel = Object.assign({}, model);
    for (const key of Object.keys(model)) {
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
    const values = {};
    for (const key of Object.keys(model)) {
        values[key] = model[key].value;
    }
    return values;
}
exports.getValuesFromModel = getValuesFromModel;

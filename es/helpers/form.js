"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Field_1 = require("../components/Field");
const Form_1 = require("../components/Form");
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
    for (const key of Object.keys(model)) {
        values[key] = model[key].value;
    }
    return values;
}
exports.getValuesFromModel = getValuesFromModel;
function createFormFactory(defaultValues) {
    const Fields = {};
    Object.keys(defaultValues).forEach(key => {
        Fields[key] = Field_1.Field;
    });
    return {
        Form: Form_1.Form,
        Fields,
    };
}
exports.createFormFactory = createFormFactory;

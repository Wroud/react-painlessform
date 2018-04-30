"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mergeModels(value, model, rest) {
    const newModel = Object.assign({}, model);
    for (const key of Object.keys(value)) {
        const preState = Object.assign({}, (newModel[key] || {}), value[key]);
        newModel[key] = Object.assign({}, preState, (rest ? rest(preState, (model[key] || {})) : {}));
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
function getMapsFromModel(model) {
    const maps = {
        values: {},
        isChanged: {},
        isVisited: {},
    };
    if (typeof model !== "object") {
        return undefined;
    }
    for (const key of Object.keys(model)) {
        maps.values[key] = model[key].value;
        maps.isVisited[key] = model[key].isVisited;
        maps.isChanged[key] = model[key].isChanged;
    }
    return maps;
}
exports.getMapsFromModel = getMapsFromModel;

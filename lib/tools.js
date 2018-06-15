"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function deepExtend(destination, source) {
    if (Array.isArray(destination)) {
        destination.length = 0;
        destination.push.apply(destination, source);
        return;
    }
    for (const property in source) {
        if (typeof source[property] === "object"
            && source[property] !== null
            && !Array.isArray(source[property])) {
            destination[property] = Object.assign({}, destination[property]) || {};
            deepExtend(destination[property], source[property]);
        }
        else if (source[property] !== "__delete__") {
            destination[property] = source[property];
        }
        else {
            delete destination[property];
        }
    }
}
exports.deepExtend = deepExtend;
function isArrayEqual(array0, array1) {
    if (!Array.isArray(array0) || !Array.isArray(array1)) {
        return array0 === array1;
    }
    if (array0.length !== array1.length) {
        return false;
    }
    return !array0.some((element, index) => {
        return element !== array1[index];
    });
}
exports.isArrayEqual = isArrayEqual;
function isInputChangeEvent(object) {
    return "target" in object;
}
exports.isInputChangeEvent = isInputChangeEvent;
function isSelectChangeEvent(object) {
    return "target" in object && "options" in object.target;
}
exports.isSelectChangeEvent = isSelectChangeEvent;
function isYup(object) {
    return "validateSync" in object;
}
exports.isYup = isYup;
function forEachElement(iterator, action) {
    let result = iterator.next();
    const array = [];
    while (!result.done) {
        array.push(action(result.value));
        result = iterator.next();
    }
    return array[Symbol.iterator]();
}
exports.forEachElement = forEachElement;
function* exchangeIterator(iterator, action) {
    let result = iterator.next();
    while (!result.done) {
        yield* action(result.value);
        result = iterator.next();
    }
}
exports.exchangeIterator = exchangeIterator;
//# sourceMappingURL=tools.js.map
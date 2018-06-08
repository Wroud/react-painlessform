"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
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
            this.deepExtend(destination[property], source[property]);
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
function getFromObject(object, keys, defaultVal = null) {
    keys = Array.isArray(keys) ? keys : keys.replace(/(\[(\d)\])/g, ".$2").split(".");
    object = object[keys[0]];
    if (object && keys.length > 1) {
        return getFromObject(object, keys.slice(1), defaultVal);
    }
    return object === undefined ? defaultVal : object;
}
exports.getFromObject = getFromObject;
function fromProxy(proxy, selector, defaultValue) {
    const value = selector(proxy);
    const bval = typeof value === "object" && !util_1.isArray(value) && value["@autoCreatedProxy"] === true
        ? defaultValue
        : value;
    return bval;
}
exports.fromProxy = fromProxy;
function autoCreateProxy(model) {
    return new Proxy(model, {
        get(target, prop) {
            let selectedVal = target[prop];
            if (selectedVal === undefined) {
                selectedVal = { "@autoCreatedProxy": true };
            }
            if (typeof selectedVal === "object") {
                return autoCreateProxy(selectedVal);
            }
            return selectedVal;
        }
    });
}
exports.autoCreateProxy = autoCreateProxy;
function getPath(selector, data) {
    let path = "";
    const proxyFactory = object => new Proxy(object, {
        get(target, prop) {
            if (prop === undefined) {
                return {};
            }
            path += !isNaN(prop.toString())
                ? `[${prop}]`
                : path === ""
                    ? `${prop}`
                    : `.${prop}`;
            let selectedVal = target[prop];
            if (selectedVal === undefined) {
                selectedVal = {};
            }
            if (typeof selectedVal === "object") {
                return proxyFactory(selectedVal);
            }
            else {
                return selectedVal;
            }
        }
    });
    selector(proxyFactory(data));
    return path;
}
exports.getPath = getPath;
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
function setPathValue(value, selector, to) {
    let lastProperty = "";
    let lastParent;
    const proxyFactory = object => new Proxy(object, {
        get(target, prop) {
            if (prop === undefined) {
                return undefined;
            }
            const newTarget = lastParent
                ? !isNaN(prop.toString()) ? [...(util_1.isArray(target) ? target : [])] : Object.assign({}, target)
                : target;
            if (lastParent) {
                lastParent[lastProperty] = newTarget;
            }
            lastProperty = prop;
            lastParent = newTarget;
            if (newTarget[prop] === undefined) {
                newTarget[prop] = {};
            }
            if (typeof newTarget[prop] === "object") {
                return proxyFactory(newTarget[prop]);
            }
            else {
                return newTarget[prop];
            }
        }
    });
    selector(proxyFactory(to));
    if (value === undefined) {
        delete lastParent[lastProperty];
    }
    else {
        lastParent[lastProperty] = value;
    }
}
exports.setPathValue = setPathValue;
//# sourceMappingURL=tools.js.map
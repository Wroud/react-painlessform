export function concat(...units) {
    return ((...args) => [].concat(...units.map(unit => unit(...args))));
}
export function reduce(...units) {
    return ((...args) => units.reduce((prev, unit) => (Object.assign({}, prev, unit(...args))), {}));
}
export function isArrayEqual(array0, array1) {
    if (array0 !== array1
        && (array0 === undefined || array1 === undefined)) {
        return false;
    }
    if (array0 !== undefined
        && array1 !== undefined
        && array0.length !== array1.length) {
        return false;
    }
    for (const index in array0) {
        if (array0[index] !== array1[index]) {
            return false;
        }
    }
    return true;
}
export function mergeFormErrors(one, two) {
    let merged = one || {};
    if (two) {
        for (const key of Object.keys(two)) {
            if (two[key].length > 0) {
                merged = Object.assign({}, merged, { [key]: [...(merged[key] || []), ...two[key]] });
            }
        }
    }
    return merged;
}

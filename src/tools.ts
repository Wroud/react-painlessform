import { FormErrors } from "./FormValidator";

export function concat<T extends (...args) => any[]>(...units: T[]): T {
    return ((...args) => ([] as any[]).concat(...units.map(unit => unit(...args)))) as T;
}
export function reduce<T extends (...args) => any>(...units: T[]): T {
    return ((...args) => units.reduce((prev, unit) => ({ ...prev, ...unit(...args) }), {})) as T;
}
export function isArrayEqual(array0: any[], array1: any[]) {
    if (array0 !== array1
        && (array0 === undefined || array1 === undefined)
    ) {
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
export function mergeFormErrors(one: FormErrors<any>, two: FormErrors<any>) {
    let merged = one || {};
    if (two) {
        for (const key of Object.keys(two)) {
            if (two[key].length > 0) {
                merged = {
                    ...merged,
                    [key]: [...(merged[key] || []), ...two[key]],
                };
            }
        }
    }
    return merged;
}

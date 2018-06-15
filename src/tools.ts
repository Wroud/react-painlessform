import * as React from "react";
import * as Yup from "yup";

export function deepExtend(destination, source) {
    if (Array.isArray(destination)) {
        destination.length = 0;
        destination.push.apply(destination, source);
        return;
    }
    for (const property in source) {
        if (typeof source[property] === "object"
            && source[property] !== null
            && !Array.isArray(source[property])) {

            destination[property] = { ...destination[property] } || {};
            deepExtend(destination[property], source[property]);
        } else if (source[property] !== "__delete__") {
            destination[property] = source[property];
        } else {
            delete destination[property];
        }
    }
}

export function isArrayEqual(array0: any[], array1: any[]) {
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

export function isInputChangeEvent(object): object is React.ChangeEvent<HTMLInputElement> {
    return "target" in object;
}

export function isSelectChangeEvent(object): object is React.ChangeEvent<HTMLSelectElement> {
    return "target" in object && "options" in object.target;
}

export function isYup(object): object is Yup.Schema<any> {
    return "validateSync" in object;
}

export function forEachElement<TValue, TResult>(iterator: IterableIterator<TValue>, action: (element: TValue) => TResult) {
    let result = iterator.next();
    const array: TResult[] = [];
    while (!result.done) {
        array.push(action(result.value));
        result = iterator.next();
    }
    return array[Symbol.iterator]();
}
export function* exchangeIterator<TValue, TResult>(iterator: IterableIterator<TValue>, action: (element: TValue) => IterableIterator<TResult>) {
    let result = iterator.next();
    while (!result.done) {
        yield* action(result.value);
        result = iterator.next();
    }
}

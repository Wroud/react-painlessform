import deepEqual = require("deep-equal");
import { isArray } from "util";
import { FieldSelector, FieldStateSelect, IFieldState, IUpdateEvent } from "../interfaces/field";
import { FieldsState } from "../interfaces/form";
import { autoCreateProxy, deepExtend, fromProxy, getPath, setPathValue } from "../tools";

/**
 * Update `model` with [[Field]] `state`
 * @param value [[Field]]s state
 * @param model [[Form]] `model`
 */
export function updateModelFields<T>(value: Partial<IFieldState>, model: FieldsState<T>, fields: Array<(model) => any>) {
    const newModel: FieldsState<T> = { ...(model as any) };
    fields.forEach(selector => {
        const prevValue = fromProxy<FieldsState<T>, IFieldState>(autoCreateProxy(newModel), selector, {});
        setPathValue(selector, newModel, { ...prevValue, ...value });
    });
    return newModel;
}

/**
 * Sets `values` to `model`
 * @param values fields values
 * @param model [[Form]] `model`
 */
export function setModelValues<T extends object>(value: T, model: T, rest?: Partial<IFieldState>) {
    const newValue: T = { ...model as any };
    deepExtend(newValue, value);
    return { model: newValue, isChanged: deepEqual(model, newValue) };
}

export function updateField<T, M>(field: FieldStateSelect<M>, index: number, value: T, state: IFieldState) {
    return { field, index, value, state };
}

export const isField = <TModel>(state: TModel, from: IUpdateEvent) => {
    const path = getPath(from.selector, state);
    return (field: FieldSelector<TModel>) => {
        return path.includes(getPath(field, state));
    };
};

// export function isDiffEqual<T>(diff: IFieldState<T> | Array<IFieldState<T>>, value: IFieldState<T> | Array<IFieldState<T>>) {
//     if (!diff || !value) {
//         return diff === value;
//     }
//     if (Array.isArray(diff)) {
//         for (const index of diff) {
//             if (Array.isArray(diff[index].value) && Array.isArray(value.value)) {
//                 return isArrayEqual(diff.value, value.value);
//             }
//         }
//     }
//     if (Array.isArray(diff.value) && Array.isArray(value.value)) {
//         return isArrayEqual(diff.value, value.value);
//     }
//     return diff.value === value.value;
// }

// export function isValueEqual<T>(one: IFieldState<T> | T, two: IFieldState<T> | T) {
//     if (!one || !two) {
//         return one === two;
//     }
//     if (isFieldState(one) && isFieldState(two)) {
//         if (Array.isArray) {
//             if (Array.isArray(one.value) && Array.isArray(two.value)) {
//                 return isArrayEqual(one.value, two.value);
//             }
//         }
//         return one.value === two.value;
//     } else {
//         if (Array.isArray(one) && Array.isArray(two)) {
//             return isArrayEqual(one, two);
//         }
//         return one === two;
//     }
// }

export function getInputValue<T>(value: T, forwardedValue: T, type: string, multiple: boolean) {
    if (/radio/.test(type) || /checkbox/.test(type)) {
        return forwardedValue;
    }
    const defaultValue = multiple ? [] : "";
    const castValue = /number|range/.test(type) && isNaN(value as any)
        || value === undefined
        ? defaultValue
        : value;
    return forwardedValue !== undefined
        ? forwardedValue
        : castValue;
}

export function getInputChecked<T>(value: T, forwardedValue: T, type: string) {
    if (/checkbox/.test(type)) {
        // console.log(">>>", value, forwardedValue);
        return forwardedValue !== undefined && isArray(value) ? value.indexOf(forwardedValue) !== -1 : value;
    }
    if (/radio/.test(type)) {
        return value === forwardedValue;
    }
    return undefined;
}

export function getValue<T>(value: T, type: string, forwardedValue: T, multiple: boolean) {
    if (/checkbox/.test(type)) {
        return value || false;
        return typeof value === "boolean"
            ? value
            : value === forwardedValue;
    }
    if (/number/.test(type)) {
        return value === undefined ? 0 : value;
    }

    return value === undefined ? multiple ? [] : "" : value;
}

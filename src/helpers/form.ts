import { IFieldState } from "../interfaces/field";
import { FormModel, IModelMap } from "../interfaces/form";
import { isArrayEqual, isFieldState } from "../tools";

export function mergeModels<T>(value: Partial<FormModel<T>> | FormModel<T>, model: Partial<FormModel<T>> | FormModel<T>, rest?: (value: IFieldState<T>, prev: IFieldState<T>) => Partial<IFieldState<T>>) {
    const newModel: FormModel<T> = { ...(model as any) };
    for (const key of Object.keys(value)) {
        newModel[key] = {
            ...(newModel[key] || {}),
            ...value[key],
            ...(rest ? rest(value[key], (model[key] || {})) : {})
        };
    }
    return newModel;
}

/**
 * Update `model` with [[Field]] `state`
 * @param value [[Field]]s state
 * @param model [[Form]] `model`
 */
export function updateModelFields<T>(value: Partial<IFieldState<any>>, model: FormModel<T>) {
    const newModel: FormModel<T> = { ...(model as any) };
    for (const key of Object.keys(model)) {
        newModel[key] = {
            ...newModel[key],
            ...value
        };
    }
    return newModel;
}

/**
 * Sets `values` to `model`
 * @param values fields values
 * @param model [[Form]] `model`
 */
export function setModelValues<T>(values: T, model: FormModel<T>, rest?: Partial<IFieldState<T>>) {
    const newModel: FormModel<T> = { ...(model as any) };
    for (const key of Object.keys(values)) {
        newModel[key] = {
            ...(newModel[key] || {}),
            value: values[key],
            ...(rest || {})
        };
    }
    return newModel;
}

export function isValueEqual<T>(one: IFieldState<T> | T, two: IFieldState<T> | T) {
    if (isFieldState(one) && isFieldState(two)) {
        if (Array.isArray(one.value) && Array.isArray(two.value)) {
            return isArrayEqual(one.value, two.value);
        }
        return one.value === two.value;
    } else {
        if (Array.isArray(one) && Array.isArray(two)) {
            return isArrayEqual(one, two);
        }
        return one === two;
    }
}
/**
 * Sets all fields `value` to empty string and `isChanged` & `isVisited` to `false`
 * @param model [[Form]] `model`
 */
export function resetModel<T>(model: FormModel<T>) {
    let newModel: FormModel<T> = {} as any;
    for (const key of Object.keys(model)) {
        newModel = {
            ...newModel as any,
            [key]: {
                value: "",
                isChanged: false,
                isVisited: false,
                isFocus: false
            }
        };
    }
    return newModel;
}

/**
 * Selects `values` from [[Form]] `model`
 * @param model [[Form]] `model`
 */
export function getValuesFromModel<T>(model: FormModel<T>): T {
    const values: T = {} as any;
    if (typeof model !== "object") {
        return undefined;
    }
    for (const key of Object.keys(model)) {
        values[key] = model[key].value;
    }
    return values;
}

export function getMapsFromModel<T>(model: FormModel<T>): IModelMap<T> {
    const maps = {
        values: {},
        isChanged: {},
        isVisited: {}
    } as IModelMap<T>;
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

export function getInputValue<T>(value: T, forwardedValue: T, type: string, multiple: boolean) {
    if (/radio/.test(type)) {
        return forwardedValue;
    }
    const defaultValue = multiple ? [] : "";
    const castValue = type === "checkbox" && typeof value !== "boolean"
        ? false
        : /number|range/.test(type) && isNaN(value as any)
            || value === undefined
            ? defaultValue
            : value;
    return forwardedValue !== undefined
        ? forwardedValue
        : castValue;
}

export function getInputChecked<T>(value: T, forwardedValue: T, type: string) {
    if (/checkbox/.test(type)) {
        return value;
    }
    if (/radio/.test(type)) {
        return value === forwardedValue;
    }
    return undefined;
}

export function getValue<T>(value: T, type: string, forwardedValue: T, index: number) {
    if (index !== undefined && /checkbox/.test(type)) {
        return Array.isArray(value) ? value.some(val => val === forwardedValue) : false;
    }
    const castValue = index === undefined
        ? value
        : Array.isArray(value)
            ? value[index]
            : undefined;

    return type === "checkbox" && typeof castValue !== "boolean"
        ? false
        : castValue;
}

export function setValue<T>(
    to: T[],
    value: T,
    forwardedValue: T,
    type: string,
    index: number,
    unmounting: boolean,
    multiple: boolean
): T[] | T {
    if (type === "checkbox") {
        const castValue = typeof value !== "boolean" ? false : unmounting ? false : value;
        if (index === undefined) {
            return castValue as T;
        }

        const result = Array.isArray(to) ? to : [];
        const currentIndex = result.indexOf(forwardedValue);
        if (currentIndex > -1) {
            return castValue ? result : result.slice(currentIndex, 1);
        }
        return castValue ? [...result, forwardedValue] : result;
    }
    const defaultValue = multiple ? [] : "";
    if (index === undefined) {
        return unmounting ? defaultValue : value as any;
    }
    const newValue = Array.isArray(to) ? [...to] : [];
    newValue[index] = unmounting ? defaultValue : value as any;
    return newValue;
}

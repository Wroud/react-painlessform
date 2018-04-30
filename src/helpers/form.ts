import { IFieldState } from "../interfaces/field";
import { BooleanMap, FormModel, IModelMap } from "../interfaces/form";

export function mergeModels<T>(value: Partial<FormModel<T>>, model: FormModel<T>, rest?: (value: IFieldState<T>, prev: IFieldState<T>) => Partial<IFieldState<T>>) {
    const newModel: FormModel<T> = { ...(model as any) };
    for (const key of Object.keys(value)) {
        const preState = {
            ...(newModel[key] || {}),
            ...value[key],
        };
        newModel[key] = {
            ...preState,
            ...(rest ? rest(preState, (model[key] || {})) : {}),
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
            ...value,
        };
    }
    return newModel;
}

/**
 * Update `model` with `values`
 * @param values fields values
 * @param model [[Form]] `model`
 */
export function updateModel<T>(values: T, model: FormModel<T>, rest?: Partial<IFieldState<T>>) {
    const newModel: FormModel<T> = { ...(model as any) };
    for (const key of Object.keys(values)) {
        newModel[key] = {
            ...(newModel[key] || {}),
            value: values[key],
            ...(rest || {}),
        };
    }
    return newModel;
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
            },
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
    const maps: IModelMap<T> = {
        values: {},
        isChanged: {},
        isVisited: {},
    } as any;
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

import deepEqual = require("deep-equal");
import { isArray } from "util";
import { FieldValue, IFieldState, InputValue, IUpdateEvent, UpdateValue } from "../interfaces/field";
import { FieldsState } from "../interfaces/form";
import { Path } from "../Path";
import { deepExtend } from "../tools";

/**
 * Update `model` with [[Field]] `state`
 * @param value [[Field]]s state
 * @param state [[Form]] `model`
 */
export function updateFieldsState<T>(value: Partial<IFieldState>, state: FieldsState<T>, fields: Array<Path<FieldsState<T>, IFieldState>>) {
    const newModel: FieldsState<T> = { ...(state as any) };
    fields.forEach(selector => {
        const prevValue = selector.getValue(newModel, {} as IFieldState);
        selector.setValueImmutable(newModel, { ...prevValue, ...value });
    });
    return newModel;
}

/**
 * Sets `values` to `model`
 * @param values fields values
 * @param model [[Form]] `model`
 */
export function mergeModels<T extends object>(value: T, model: T) {
    const newValue: T = { ...model as any };
    deepExtend(newValue, value);
    return { model: newValue, isChanged: deepEqual(model, newValue) };
}

export const isField = <TModel extends object>(
    state: TModel,
    from: IUpdateEvent<TModel, UpdateValue>,
    scope: Path<any, TModel>
) =>
    <TValue>(field: (values: TModel) => TValue, strict?: boolean) => {
        return from.selector.includes(scope.join(Path.fromSelector(field)), strict);
    };

export function getInputValue<T>(value: T, type: string, forwardedValue?: InputValue, multiple?: boolean): InputValue {
    if (/radio/.test(type) || /checkbox/.test(type)) {
        return forwardedValue || "";
    }
    const castValue = /number|range/.test(type) && isNaN(value as any)
        ? 0
        : value === undefined
            ? ""
            : value as any as string;
    return forwardedValue !== undefined
        ? forwardedValue
        : castValue;
}

export function getInputChecked(value: FieldValue | undefined, type: string, forwardedValue?: InputValue) {
    if (/checkbox/.test(type)) {
        return isArray(value) && forwardedValue
            ? value.indexOf(forwardedValue as string) !== -1
            : value as boolean;
    }
    if (/radio/.test(type)) {
        return value === forwardedValue;
    }
    return undefined;
}

export function getDefaultValue<T>(value: T, type: string, multiple?: boolean): T {
    if (/checkbox/.test(type)) {
        return value || false as any;
    }
    if (/number|range/.test(type)) {
        return value === undefined ? 0 : value as any;
    }

    return value !== undefined
        ? value
        : multiple
            ? []
            : "" as any;
}

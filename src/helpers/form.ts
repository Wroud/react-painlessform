import { IScopeContext, ScopeSelector } from "components/Scope";
import deepEqual = require("deep-equal");
import { isArray } from "util";
import { FieldSelector, FieldStateSelector, IFieldState, IUpdateEvent } from "../interfaces/field";
import { FieldsState } from "../interfaces/form";
import { autoCreateProxy, deepExtend, fromProxy, getPath, setPathValue } from "../tools";

/**
 * Update `model` with [[Field]] `state`
 * @param value [[Field]]s state
 * @param model [[Form]] `model`
 */
export function updateFieldsState<T>(value: Partial<IFieldState>, model: FieldsState<T>, fields: Array<(model) => any>) {
    const newModel: FieldsState<T> = { ...(model as any) };
    fields.forEach(selector => {
        const prevValue = fromProxy<FieldsState<T>, IFieldState>(autoCreateProxy(newModel), selector, {});
        setPathValue({ ...prevValue, ...value }, selector, newModel);
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

export function updateField<T, M>(field: FieldStateSelector<M>, index: number, value: T, state: IFieldState) {
    return { field, index, value, state };
}

export const isField = <TModel extends object>(state: TModel, from: IUpdateEvent<TModel>, scope: IScopeContext) => {
    const path = getPath(from.selector, state);
    return (field: FieldSelector<TModel>, strict?: boolean) => {
        return strict
            ? path === getPath(scope(field), state)
            : path.includes(getPath(scope(field), state));
    };
};

export function getInputValue<T>(value: T, forwardedValue: T, type: string, multiple?: boolean) {
    if (/radio/.test(type) || /checkbox/.test(type)) {
        return forwardedValue;
    }
    const defaultValue = multiple ? [] : "";
    const castValue = /number|range/.test(type) && isNaN(value as any)
        ? 0
        : value;
    return forwardedValue !== undefined
        ? forwardedValue
        : castValue;
}

export function getInputChecked<T>(value: T, forwardedValue: T, type: string) {
    if (/checkbox/.test(type)) { // forwardedValue !== undefined
        return isArray(value) ? value.indexOf(forwardedValue) !== -1 : value;
    }
    if (/radio/.test(type)) {
        return value === forwardedValue;
    }
    return undefined;
}

export function getValue<T>(value: T, type: string, forwardedValue: T, multiple?: boolean) {
    if (/checkbox/.test(type)) {
        return value || false;
    }
    if (/number|range/.test(type)) {
        return value === undefined ? 0 : value;
    }

    return value !== undefined
        ? value
        : multiple
            ? []
            : "";
}

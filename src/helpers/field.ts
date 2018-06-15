import shallowequal = require("shallowequal");
import { isArray } from "util";
import { FieldValue, IFieldState, InputValue, IUpdateEvent, UpdateValue } from "../interfaces/field";
import { IFormStorage } from "../interfaces/form";
import { isArrayEqual } from "../tools";

export function castValue<T extends FieldValue>(
    to: T | undefined,
    value: T | FieldValue,
    type: string,
    forwardedValue?: InputValue,
    multiple?: boolean
): T | FieldValue | undefined {
    let result = value;
    if (/checkbox/.test(type)) {
        result = value === true;
        if (forwardedValue !== undefined && multiple) {
            let castTo = Array.isArray(to) ? [...to] : [];
            const indexOf = castTo.indexOf(forwardedValue);

            if (indexOf === -1 && result) {
                castTo = [...castTo, forwardedValue];
            } else if (indexOf > -1 && !result) {
                castTo.splice(indexOf, 1);
            }
            result = castTo;
        }
    } else if (/radio/.test(type)) {
        result = result !== undefined
            ? result
            : to === undefined || to === forwardedValue
                ? ""
                : to;
    }
    return result;
}
export function getInputState(value: FieldValue | undefined, type: string, forwardedValue?: InputValue, multiple?: boolean) {
    const isCheckbox = /checkbox/i.test(type);
    const isRadio = /radio/i.test(type);
    let checked: boolean | undefined;
    let inputValue: InputValue;
    if (isRadio || isCheckbox) {
        checked = !isCheckbox
            ? value === forwardedValue
            : isArray(value) && forwardedValue
                ? value.indexOf(forwardedValue as string) !== -1
                : value as boolean;
        inputValue = forwardedValue || "" as InputValue;
    } else {
        const castedValue = /number|range/i.test(type) && isNaN(value as any)
            ? 0 : value === undefined ? "" : value;
        inputValue = forwardedValue !== undefined
            ? forwardedValue
            : castedValue as InputValue;
    }
    return {
        type,
        value: inputValue,
        checked,
        multiple
    };
}

export function getDefaultValue<T>(value: T, type: string, multiple?: boolean): T {
    if (/checkbox/i.test(type)) {
        return value || false as any;
    }
    if (/number|range/i.test(type)) {
        return value === undefined ? 0 : value as any;
    }

    return value !== undefined
        ? value
        : multiple
            ? []
            : "" as any;
}

export function isDiffEqual<TModel extends object>(diff: IUpdateEvent<TModel, UpdateValue>, model: IFormStorage<TModel>) {
    let equal = true;
    if (diff.value !== undefined) {
        const value = diff.selector.getValue(model.values);
        equal = equal && isValueEqual(value, diff.value);
    }
    if (diff.state !== undefined) {
        const state = diff.selector.getValue(model.state as any) as IFieldState;
        equal = equal && shallowequal(state, diff.state);
    }
    return equal;
}

export function isValueEqual<T>(diff: T, value: T) {
    if (!diff || !value || !isArray(diff)) {
        return diff === value;
    }
    return isArrayEqual(diff, value as any);
}

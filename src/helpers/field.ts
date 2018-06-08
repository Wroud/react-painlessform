import shallowequal = require("shallowequal");
import { isArray } from "util";
import { InputType } from "../components/Field";
import { IFieldState, InputValue, IUpdateEvent } from "../interfaces/field";
import { FieldsState, IFormStorage } from "../interfaces/form";
import { autoCreateProxy, fromProxy, isArrayEqual } from "../tools";

export function castValue<T>(
    to: T,
    value: T,
    forwardedValue: InputType<T>,
    type: string,
    multiple?: boolean
): T {
    let result = value;
    if (type === "checkbox") {
        result = ((value as any) === true) as any;
        if (forwardedValue !== undefined && multiple) {
            let castTo = Array.isArray(to) ? [...to] : [];
            const indexOf = castTo.indexOf(forwardedValue);

            if (indexOf > -1) {
                if (result) {
                    castTo = [...castTo, forwardedValue];
                } else {
                    castTo.splice(indexOf, 1);
                }
            }
            result = castTo as any;
        }
    }
    if (type === "radio") {
        return result !== undefined
            ? result
            : to === forwardedValue
                ? "" as any
                : to;
    }
    return result;
}

export function isDiffEqual<T extends object>(diff: IUpdateEvent, model: IFormStorage<T>) {
    const value = fromProxy(autoCreateProxy(model.values), diff.selector);
    const state = fromProxy<FieldsState<T>, IFieldState>(
        autoCreateProxy(model.state),
        diff.selector
    );
    return isValueEqual(value, diff.value)
        && shallowequal(state, diff.state);
}

export function isValueEqual<T>(diff: T, value: T) {
    if (!diff || !value || !isArray(diff)) {
        return diff === value;
    }
    return isArrayEqual(diff, value as any);
}

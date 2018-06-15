import { FieldValue, InputValue, IUpdateEvent, UpdateValue } from "../interfaces/field";
import { IFormStorage } from "../interfaces/form";
export declare function castValue<T extends FieldValue>(to: T | undefined, value: T | FieldValue, type: string, forwardedValue?: InputValue, multiple?: boolean): T | FieldValue | undefined;
export declare function getInputState(value: FieldValue | undefined, type: string, forwardedValue?: InputValue, multiple?: boolean): {
    type: string;
    value: string | number | string[];
    checked: boolean | undefined;
    multiple: boolean | undefined;
};
export declare function getDefaultValue<T>(value: T, type: string, multiple?: boolean): T;
export declare function isDiffEqual<TModel extends object>(diff: IUpdateEvent<TModel, UpdateValue>, model: IFormStorage<TModel>): boolean;
export declare function isValueEqual<T>(diff: T, value: T): boolean;

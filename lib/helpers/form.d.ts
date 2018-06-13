import { FieldValue, IFieldState, InputValue, IUpdateEvent, UpdateValue } from "../interfaces/field";
import { FieldsState } from "../interfaces/form";
import { Path } from "../Path";
/**
 * Update `model` with [[Field]] `state`
 * @param value [[Field]]s state
 * @param state [[Form]] `model`
 */
export declare function updateFieldsState<T>(value: Partial<IFieldState>, state: FieldsState<T>, fields: Array<Path<FieldsState<T>, IFieldState>>): FieldsState<T>;
/**
 * Sets `values` to `model`
 * @param values fields values
 * @param model [[Form]] `model`
 */
export declare function mergeModels<T extends object>(value: T, model: T): {
    model: T;
    isChanged: boolean;
};
export declare const isField: <TModel extends object>(state: TModel, from: IUpdateEvent<TModel, UpdateValue>, scope: Path<any, TModel>) => <TValue>(field: (values: TModel) => TValue, strict?: boolean | undefined) => boolean;
export declare function getInputValue<T>(value: T, type: string, forwardedValue?: InputValue, multiple?: boolean): InputValue;
export declare function getInputChecked(value: FieldValue | undefined, type: string, forwardedValue?: InputValue): boolean | undefined;
export declare function getDefaultValue<T>(value: T, type: string, multiple?: boolean): T;

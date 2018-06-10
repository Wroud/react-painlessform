import { IScopeContext } from "components/Scope";
import { FieldSelector, FieldStateSelector, IFieldState, IUpdateEvent } from "../interfaces/field";
import { FieldsState } from "../interfaces/form";
/**
 * Update `model` with [[Field]] `state`
 * @param value [[Field]]s state
 * @param model [[Form]] `model`
 */
export declare function updateFieldsState<T>(value: Partial<IFieldState>, model: FieldsState<T>, fields: Array<(model) => any>): FieldsState<T>;
/**
 * Sets `values` to `model`
 * @param values fields values
 * @param model [[Form]] `model`
 */
export declare function setModelValues<T extends object>(value: T, model: T, rest?: Partial<IFieldState>): {
    model: T;
    isChanged: boolean;
};
export declare function updateField<T, M>(field: FieldStateSelector<M>, index: number, value: T, state: IFieldState): {
    field: FieldStateSelector<M>;
    index: number;
    value: T;
    state: IFieldState;
};
export declare const isField: <TModel extends object>(state: TModel, from: IUpdateEvent, scope: IScopeContext) => (field: FieldSelector<TModel>, strict?: boolean) => boolean;
export declare function getInputValue<T>(value: T, forwardedValue: T, type: string, multiple: boolean): 0 | T;
export declare function getInputChecked<T>(value: T, forwardedValue: T, type: string): boolean | T;
export declare function getValue<T>(value: T, type: string, forwardedValue: T, multiple: boolean): false | any[] | "" | 0 | T;

import { FieldsState } from "./form";

export interface IFieldState {
    isChanged: boolean;
    isVisited: boolean;
    isFocus: boolean;
}

export type InputValue = string[] | boolean | string | number;

export interface IUpdateEvent {
    selector: FieldSelector<any>;
    value: InputValue | object;
    state: IFieldState;
}

export type NeverState<T> = T extends FieldsState<infer P> ? never : T;

export type FieldStateSelect<TModel> = (state: FieldsState<TModel>) => IFieldState;
export type FieldSelector<TModel> = (values: TModel | FieldsState<TModel>) => any;
export type ModelFieldSelector<TModel, TValue> = (values: TModel) => TValue;

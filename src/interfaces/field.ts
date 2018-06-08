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

export type FieldStateSelector<TModel> = (state: FieldsState<TModel>) => IFieldState;
export type FieldSelector<TModel> = (values: TModel | FieldsState<TModel>) => any;
export type ModelFieldSelector<TModel, TValue> = (values: TModel) => TValue;

import { FieldsState } from "./form";

export interface IFieldState {
    isChanged: boolean;
    isVisited: boolean;
    isFocus: boolean;
}

export type InputValue = string[] | string | number;
export type FieldValue = string[] | boolean | string | number | object;

export interface IUpdateEvent<TModel> {
    selector: FieldSelector<TModel>;
    value?: FieldValue | object | null;
    state?: IFieldState | null;
    global?: boolean;
}

export type FieldStateSelector<TModel> = (state: FieldsState<TModel>) => IFieldState;
export type FieldSelector<TModel> = (values: TModel | FieldsState<TModel>) => any;
export type ModelFieldSelector<TModel, TValue> = (values: TModel) => TValue;

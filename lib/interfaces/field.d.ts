import { FieldsState } from "./form";
export interface IFieldState {
    isChanged: boolean;
    isVisited: boolean;
    isFocus: boolean;
}
export declare type InputValue = string[] | boolean | string | number;
export interface IUpdateEvent<TModel> {
    selector: FieldSelector<TModel>;
    value?: InputValue | object | null;
    state?: IFieldState | null;
    global?: boolean;
}
export declare type FieldStateSelector<TModel> = (state: FieldsState<TModel>) => IFieldState;
export declare type FieldSelector<TModel> = (values: TModel | FieldsState<TModel>) => any;
export declare type ModelFieldSelector<TModel, TValue> = (values: TModel) => TValue;

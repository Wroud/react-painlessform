import { IErrorMessage } from "../FormValidator";
import { Path } from "../Path";
import { FieldsState } from "./form";
import { ValidationModel } from "./validation";

export interface IFieldState {
    isChanged: boolean;
    isVisited: boolean;
    isFocus: boolean;
}

export type FieldPath<TModel, TValue> = Path<TModel | FieldsState<TModel> | ValidationModel<TModel>, TValue | IFieldState | Array<IErrorMessage<any>>>;

export type InputValue = string[] | string | number;
export type FieldValue = string[] | boolean | string | number | object;
export type UpdateValue = FieldValue | null | undefined;

export interface IUpdateEvent<TModel, TValue> {
    selector: FieldPath<TModel, TValue>;
    value?: TValue | null;
    state?: IFieldState | null;
    global?: boolean;
}

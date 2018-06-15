import { IValidationProps } from "../components/Validation";
import { IErrorMessage } from "../FormValidator";
import { Path } from "../Path";
export interface IValidatorState {
}
export interface IValidatorConfig {
}
export interface IValidationMeta<T> {
    state: IValidatorState;
    props: IValidationProps<T>;
    config: IValidatorConfig;
}
export interface IValidationState<T> {
    errors: ValidationModel<T>;
    isValid: boolean;
}
export interface IValidationErrors<TModel> {
    selector?: Path<TModel, any>;
    errors?: Array<IErrorMessage<any>>;
    scope?: Array<IErrorMessage<any>>;
}
export declare type ValidationModel<T> = {
    [P in keyof T]: T[P] extends Array<infer S> ? S extends object ? Array<ValidationModel<S>> : Array<Array<IErrorMessage<any>>> : T[P] extends object ? ValidationModel<T[P]> : Array<IErrorMessage<any>>;
};

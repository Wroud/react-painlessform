import { IValidationProps } from "../components/Validation";
import { IErrorMessage } from "../FormValidator";
export declare type GetType<T> = T extends (...args: any[]) => infer P ? P : T;
export interface IValidationPropGetters {
    [key: string]: (...args: any[]) => any | object;
}
export declare type ValidationProps<T extends IValidationPropGetters> = {
    [P in keyof T]: GetType<T[P]>;
};
export interface IValidationMeta<T> {
    state: any;
    props: ValidationProps<IValidationProps<T>>;
}
export interface IValidationConfiguration {
}
export interface IValidationState<T> {
    errors: ValidationModel<T>;
    scope: Array<IErrorMessage<any>>;
    isValid: boolean;
}
export declare type ErrorsSelector = (model: ValidationModel<any>) => Array<IErrorMessage<any>>;
export interface IValidationErrors {
    selector: ErrorsSelector;
    errors?: Array<IErrorMessage<any>>;
    scope?: Array<IErrorMessage<any>>;
}
export declare type ValidationModel<T> = {
    [P in keyof T]: T[P] extends Array<infer S> ? S extends object ? Array<ValidationModel<S>> : Array<Array<IErrorMessage<any>>> : T[P] extends object ? ValidationModel<T[P]> : Array<IErrorMessage<any>>;
};

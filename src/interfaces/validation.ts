import { IValidationProps } from "../components/Validation";
import { IErrorMessage } from "../FormValidator";
import { Path } from "../Path";

export type GetType<T> = T extends (...args: any[]) => infer P ? P : T;

export interface IValidationPropGetters {
    [key: string]: (...args: any[]) => any | object;
}

export interface IValidatorState { }
export interface IValidatorConfig { }

export type ValidationProps<T extends IValidationPropGetters> = { [P in keyof T]: GetType<T[P]> };

export interface IValidationMeta<T> {
    state: IValidatorState;
    props: ValidationProps<IValidationProps<T>>;
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

export type ValidationModel<T> = {
    [P in keyof T]: T[P] extends Array<infer S> ? S extends object ? Array<ValidationModel<S>> : Array<Array<IErrorMessage<any>>> : T[P] extends object ? ValidationModel<T[P]> : Array<IErrorMessage<any>>;
};

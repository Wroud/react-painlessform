import { IValidationProps } from "../components/Validation";
import { IErrorMessage } from "../FormValidator";
import { FieldSelector, FieldStateSelector } from "./field";

export type GetType<T> = T extends (...args: any[]) => infer P ? P : T;

export interface IValidationPropGetters {
    [key: string]: (...args: any[]) => any | object;
}

export type ValidationProps<T extends IValidationPropGetters> = { [P in keyof T]: GetType<T[P]> };

export interface IValidationMeta<T> {
    state: any;
    props: ValidationProps<IValidationProps<T>>;
    config: any;
}

// tslint:disable-next-line:no-empty-interface
export interface IValidationConfiguration { }

export interface IValidationState<T> {
    errors: ValidationModel<T>;
    isValid: boolean;
}

export type ErrorsSelector = (model: ValidationModel<any>) => Array<IErrorMessage<any>>;

export interface IValidationErrors {
    selector: ErrorsSelector;
    errors?: Array<IErrorMessage<any>>;
    scope?: Array<IErrorMessage<any>>;
}

export type ValidationModel<T> = {
    [P in keyof T]: T[P] extends Array<infer S> ? S extends object ? Array<ValidationModel<S>> : Array<Array<IErrorMessage<any>>> : T[P] extends object ? ValidationModel<T[P]> : Array<IErrorMessage<any>>;
};

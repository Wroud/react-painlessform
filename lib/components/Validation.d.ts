/// <reference types="react" />
import * as React from "react";
import * as Yup from "yup";
import { IValidator } from "../ArrayValidator";
import { FormErrors, IErrorMessage } from "../FormValidator";
import { FormModel } from "../interfaces/form";
import { IValidationConfiguration, IValidationMeta } from "../interfaces/validation";
/**
 * Describes [[Validation]] props
 */
export interface IValidationProps<T> {
    /**
     * You can pass own errors via [[ValidationContext]]
     */
    errors?: FormErrors<T>;
    scope?: Array<IErrorMessage<any>>;
    /**
     * Function or `Yup.Schema` object that accepts form values and returns errors
     */
    validator?: IValidator<T, FormErrors<T>, IValidationMeta<T>> | Yup.Schema<T>;
    /**
     * Function thet accepts form valus and returns scope erros
     */
    scopeValidator?: IValidator<T, Array<IErrorMessage<any>>, IValidationMeta<T>>;
    /**
     * Via this prop you can configure `Yup` validation
     */
    configure?: IValidationConfiguration & Yup.ValidateOptions;
    isValid?: boolean;
    [rest: string]: any;
}
/**
 * Describes [[ValidationContext]]
 */
export interface IValidationContext<T> {
    /**
     * Validation per field errors
     */
    errors: FormErrors<T>;
    /**
     * Validation form errors
     */
    scope: Array<IErrorMessage<any>>;
    isValid: boolean;
    mountValidation: (validator: Validation<T>) => any;
    unMountValidation: (validator: Validation<T>) => any;
}
export declare const Provider: React.ComponentClass<{
    value: IValidationContext<any>;
}>, Consumer: React.ComponentClass<{
    children?: (context: IValidationContext<any>) => React.ReactNode;
}>;
export interface IValidation<T = {}> extends Validation<T> {
    new (props: IValidationProps<T>): Validation<T>;
}
/**
 * React Component that accepts [[IValidationProps]] as props
 * That component connect to [[FormContext]] and use passed `validator`, `scopeValidator`
 * to validate [[Form]] model, errors was passed via [[ValidationContext]]
 */
export declare class Validation<T> extends React.Component<IValidationProps<T>, any> {
    static defaultProps: IValidationProps<any>;
    prevErrors: {
        errors: FormErrors<T>;
        scope: IErrorMessage<any>[];
        isValid: boolean;
    };
    private validators;
    private _context;
    validate: (model: FormModel<T>) => FormModel<T>;
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    /**
     * Validation function that accepts [[FormContext]] and validate [[Form]] `model`
     */
    private validator;
    private mountValidation;
    private unMountValidation;
}

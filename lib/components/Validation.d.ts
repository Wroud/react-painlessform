/// <reference types="react" />
import * as React from "react";
import * as Yup from "yup";
import { IValidator } from "../ArrayValidator";
import { IErrorMessage } from "../FormValidator";
import { IValidationConfiguration, IValidationErrors, IValidationMeta, IValidationState } from "../interfaces/validation";
/**
 * Describes [[Validation]] props
 */
export interface IValidationProps<T> {
    /**
     * You can pass own errors via [[ValidationContext]]
     */
    errors?: IValidationErrors[];
    scope?: Array<IErrorMessage<any>>;
    /**
     * Function or `Yup.Schema` object that accepts form values and returns errors
     */
    validator?: IValidator<T, IValidationErrors, IValidationMeta<T>> | Yup.Schema<T>;
    /**
     * Function thet accepts form valus and returns scope erros
     */
    scopeValidator?: IValidator<T, IValidationErrors, IValidationMeta<T>>;
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
    validation: IValidationState<T>;
    mountValidation?: (validator: Validation<T>) => any;
    unMountValidation?: (validator: Validation<T>) => any;
}
export declare const Provider: React.ComponentType<React.ProviderProps<IValidationContext<any>>>, Consumer: React.ComponentType<React.ConsumerProps<IValidationContext<any>>>;
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
    validationState: IValidationState<T>;
    private validators;
    private _context;
    constructor(props: any);
    validate: (values: T) => IValidationState<T>;
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    /**
     * Validation function that accepts [[FormContext]] and validate [[Form]] `model`
     */
    validator(model: T): IterableIterator<IValidationErrors>;
    private generator(validator, scopeValidator, model, props, state);
    private mountValidation;
    private unMountValidation;
}

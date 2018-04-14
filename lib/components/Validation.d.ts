/// <reference types="react" />
import * as React from "react";
import { FormErrors } from "../FormValidator";
import { IValidator } from "../Validator";
import { IFormState } from "./Form";
export interface IValidationProps {
    isValid?: boolean;
    errors?: FormErrors<any>;
    validator?: IValidator<any, FormErrors<any>>;
    [rest: string]: any;
}
export interface IValidationState {
    errors: FormErrors<any>;
    isValid: boolean;
}
export declare const Provider: React.ComponentClass<{
    value: IValidationState;
}>, Consumer: React.ComponentClass<{
    children?: (context: IValidationState) => React.ReactNode;
}>;
export declare class Validation extends React.Component<IValidationProps, IValidationState> {
    prevErrors: {
        errors: {};
        isValid: boolean;
    };
    validate(form: IFormState): {
        isValid: boolean;
        errors: FormErrors<any>;
    };
    render(): JSX.Element;
}

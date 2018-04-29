import * as React from "react";
import shallowequal = require("shallowequal");
import * as Yup from "yup";

import { IValidator } from "../ArrayValidator";
import { FormErrors, IErrorMessage } from "../FormValidator";
import { getValuesFromModel } from "../helpers/form";
import { IValidationConfiguration, IValidationMeta } from "../interfaces/validation";
import { isYup } from "../tools";
import { Consumer as FormContext, IFormState } from "./Form";

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
}

// tslint:disable-next-line:no-object-literal-type-assertion
const NoErrors = {} as FormErrors<any>;
const NoScopeErrors: Array<IErrorMessage<any>> = [];

export const { Provider, Consumer } = React.createContext<IValidationContext<any>>({
    errors: NoErrors,
    scope: NoScopeErrors,
    isValid: true,
});

export interface IValidation<T = {}> extends Validation<T> {
    new(props: IValidationProps<T>): Validation<T>;
}

/**
 * React Component that accepts [[IValidationProps]] as props
 * That component connect to [[FormContext]] and use passed `validator`, `scopeValidator`
 * to validate [[Form]] model, errors was passed via [[ValidationContext]]
 */
export class Validation<T> extends React.Component<IValidationProps<T>, any> {
    static defaultProps: IValidationProps<any> = {
        isValid: true,
        configure: {},
    };
    prevErrors = {
        errors: NoErrors as FormErrors<T>,
        scope: NoScopeErrors,
        isValid: true,
    };
    /**
     * Validation function that accepts [[FormContext]] and validate [[Form]] `model`
     */
    validate = (form: IFormState<T>): IValidationContext<T> => {
        if (this.props.errors || this.props.scope) {
            return {
                errors: this.props.errors,
                scope: this.props.scope,
                isValid: this.props.isValid,
            };
        }

        const { validator, scopeValidator } = this.props;

        let errors = NoErrors as FormErrors<T>;
        let scope = NoScopeErrors;
        let isValid = true;
        const model = getValuesFromModel(form.model);

        if (!model) {
            return { errors, scope, isValid };
        }

        if (validator) {
            if (isYup(validator)) {
                try {
                    validator.validateSync(model, {
                        abortEarly: false,
                        context: {
                            state: this.state,
                            props: this.props,
                        },
                        ...this.props.configure,
                    });
                } catch (validationErrors) {
                    const _errors: Yup.ValidationError = validationErrors;
                    if (_errors.path === undefined) {
                        _errors.inner.forEach(error => {
                            errors = {
                                ...errors as any,
                                [error.path]:
                                    [...(errors[error.path] || []),
                                    ...error.errors.map(message => ({ message }))],
                            };
                        });
                    } else {
                        errors = {
                            ...errors as any,
                            [_errors.path]: [...(errors[_errors.path] || []),
                            ..._errors.errors.map(message => ({ message }))],
                        };
                    }
                    isValid = false;
                }
            } else {
                const preErrors = validator.validate(
                    model,
                    {
                        state: this.state,
                        props: this.props,
                    },
                );
                for (const key of Object.keys(preErrors)) {
                    if (preErrors[key].length > 0) {
                        isValid = false;
                        errors = preErrors;
                        break;
                    }
                }
            }
        }
        if (scopeValidator) {
            const preScope = scopeValidator.validate(
                model,
                {
                    state: this.state,
                    props: this.props,
                },
            );
            if (preScope.length > 0) {
                isValid = false;
                scope = preScope;
            }
        }

        const result = { errors, scope, isValid };

        if (!shallowequal(result, this.prevErrors)) {
            this.prevErrors = result;
            return result;
        } else {
            return this.prevErrors;
        }
    }

    render() {
        return (
            <FormContext>
                {context => <Provider value={this.validate(context)}>{this.props.children}</Provider>}
            </FormContext>
        );
    }
}

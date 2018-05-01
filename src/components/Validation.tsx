import * as React from "react";
import shallowequal = require("shallowequal");
import * as Yup from "yup";

import { IValidator } from "../ArrayValidator";
import { FormErrors, IErrorMessage } from "../FormValidator";
import { getValuesFromModel } from "../helpers/form";
import { getProps, mergeValidations } from "../helpers/validation";
import { FormModel } from "../interfaces/form";
import { IValidationConfiguration, IValidationMeta } from "../interfaces/validation";
import { isYup } from "../tools";
import { Consumer as FormContext } from "./Form";

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

const NoErrors: FormErrors<any> = {} as any;
const NoScopeErrors: Array<IErrorMessage<any>> = [];

export const { Provider, Consumer } = React.createContext<IValidationContext<any>>({
    errors: NoErrors,
    scope: NoScopeErrors,
    isValid: true
} as any);

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
        configure: {}
    };
    cacheErrors: IValidationContext<T> = {
        errors: NoErrors as FormErrors<T>,
        scope: NoScopeErrors,
        isValid: true
    } as any;
    cacheData = {
        model: {},
        props: {},
        state: {}
    };
    private validators: Array<Validation<T>> = [];
    private _context: IValidationContext<T> | undefined;
    validate = (model: FormModel<T>) => {
        let validation: IValidationContext<T> = {
            errors: NoErrors,
            scope: NoScopeErrors,
            isValid: this.props.isValid
        } as any;
        const values = getValuesFromModel(model);
        validation = mergeValidations(this.validator(values), validation);
        this.validators.forEach(validator => {
            validation = mergeValidations(validator.validator(values), validation);
        });
        this.cacheErrors = validation;
        return validation;
    }

    render() {
        return (
            <Consumer>
                {validationContext => (
                    <FormContext>
                        {formContext => {
                            this._context = validationContext.mountValidation
                                ? validationContext
                                : undefined;

                            const context: IValidationContext<T> = {
                                ...(this._context ? validationContext : this.validate(formContext.model as FormModel<T>) as any),
                                mountValidation: this.mountValidation,
                                unMountValidation: this.unMountValidation
                            };

                            return <Provider value={context}>{this.props.children}</Provider>;
                        }}
                    </FormContext>
                )}
            </Consumer>
        );
    }
    componentDidMount() {
        if (this._context) {
            this._context.mountValidation(this);
        }
    }
    componentWillUnmount() {
        if (this._context) {
            this._context.unMountValidation(this);
        }
    }
    /**
     * Validation function that accepts [[FormContext]] and validate [[Form]] `model`
     */
    private validator = (model: T): IValidationContext<T> => {
        let errors = NoErrors as FormErrors<T>;
        let scope = NoScopeErrors;
        let isValid = true;

        const props = getProps(this.props);
        const { validator, scopeValidator } = props;

        if (!model || (!validator && !scopeValidator)) {
            return { errors, scope, isValid } as IValidationContext<T>;
        }

        if (props.errors || props.scope) {
            return {
                errors: props.errors,
                scope: props.scope,
                isValid: props.isValid
            } as IValidationContext<T>;
        }

        const state = this.state;
        const data = this.cacheData;

        if (shallowequal(data.model, model)
            && shallowequal(data.props, props)
            && shallowequal(data.state, state)) {
            return this.cacheErrors;
        }

        if (validator) {
            if (isYup(validator)) {
                try {
                    validator.validateSync(model, {
                        abortEarly: false,
                        context: { state, props },
                        ...props.configure
                    });
                } catch (validationErrors) {
                    const _errors: Yup.ValidationError = validationErrors;
                    if (_errors.path === undefined) {
                        _errors.inner.forEach(error => {
                            errors = {
                                ...errors as any,
                                [error.path]:
                                    [...(errors[error.path] || []),
                                    ...error.errors.map(message => ({ message }))]
                            };
                        });
                    } else {
                        errors = {
                            ...errors as any,
                            [_errors.path]: [...(errors[_errors.path] || []),
                            ..._errors.errors.map(message => ({ message }))]
                        };
                    }
                    isValid = false;
                }
            } else {
                const preErrors = validator.validate(
                    model,
                    { state, props }
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
                { state, props }
            );
            if (preScope.length > 0) {
                isValid = false;
                scope = preScope;
            }
        }

        const result = { errors, scope, isValid } as IValidationContext<T>;

        this.cacheData = { model, props, state };
        this.cacheErrors = result;
        return result;
    }
    private mountValidation = (value: Validation<T>) => {
        this.validators.push(value);
    }
    private unMountValidation = (value: Validation<T>) => {
        const id = this.validators.indexOf(value);
        if (id > -1) {
            this.validators.slice(id, 1);
        }
    }
}

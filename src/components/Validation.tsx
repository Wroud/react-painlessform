import * as React from "react";
import { isArray } from "util";
import * as Yup from "yup";

import { IFormStorage } from "interfaces/form";
import { createFormFactory } from "..";
import { IValidator } from "../ArrayValidator";
import { IErrorMessage } from "../FormValidator";
import { getProps, yupValidator } from "../helpers/validation";
import { IValidationConfiguration, IValidationErrors, IValidationMeta, IValidationState, ValidationModel } from "../interfaces/validation";
import { autoCreateProxy, forEachElement, fromProxy, isYup, setPathValue } from "../tools";
import { IScopeContext } from "./Scope";

/**
 * Describes [[Validation]] props
 */
export interface IValidationProps<T> {
    /**
     * You can pass own errors via [[ValidationContext]]
     */
    errors?: IValidationErrors[];
    isValid?: boolean;
    /**
     * Function or `Yup.Schema` object that accepts form values and returns errors
     */
    validator?: IValidator<T, IValidationErrors, IValidationMeta<T>> | Yup.Schema<T>;
    /**
     * Via this prop you can configure `Yup` validation
     */
    configure?: IValidationConfiguration & Yup.ValidateOptions;
    [rest: string]: any;
}

/**
 * Describes [[ValidationContext]]
 */
export interface IValidationContext<T extends object> {
    scope: Array<IErrorMessage<any>>;
    isValid: boolean;
    mountValidation?: (validator: Validation<T>) => any;
    unMountValidation?: (validator: Validation<T>) => any;
}

const NoErrors = {};
const NoScope = [];

export const { Provider, Consumer } = React.createContext<IValidationContext<any>>({
    scope: NoScope,
    isValid: true
});

export interface IValidation<T extends object = {}> extends Validation<T> {
    new(props: IValidationProps<T>): Validation<T>;
}

/**
 * React Component that accepts [[IValidationProps]] as props
 * That component connect to [[FormContext]] and use passed `validator`, `scopeValidator`
 * to validate [[Form]] model, errors was passed via [[ValidationContext]]
 */
export class Validation<TModel extends object> extends React.Component<IValidationProps<TModel>, any> {
    static defaultProps: IValidationProps<any> = {
        isValid: true,
        configure: {}
    };
    private validationContext: IValidationContext<TModel>;
    private validators: Array<Validation<TModel>> = [];
    private _context: IValidationContext<TModel> | undefined;

    constructor(props) {
        super(props);
        this.validator = this.validator.bind(this);
        this.validationContext = {
            scope: NoScope,
            isValid: true,
            mountValidation: this.mountValidation,
            unMountValidation: this.unMountValidation
        };
    }

    smartValidate(storage: IFormStorage<TModel>) {
        this.validate(storage);
        for (const _validator of this.validators) {
            _validator.smartValidate(storage);
        }
    }

    render() {
        const { FormContext, ValidationContext, ScopeContext } = createFormFactory<TModel>();
        return (
            <ScopeContext>
                {scope => (
                    <ValidationContext>
                        {validationContext => (
                            <FormContext>
                                {formContext => {
                                    this._context = validationContext.mountValidation
                                        ? validationContext
                                        : undefined;

                                    this.scope = scope;
                                    this.validate(formContext.storage);
                                    return <Provider value={this.validationContext}>{this.props.children}</Provider>;
                                }}
                            </FormContext>
                        )}
                    </ValidationContext>
                )}
            </ScopeContext>
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

    private scope: IScopeContext = f => f;
    private validate = ({ values, validation }: IFormStorage<TModel>) => {
        this.validationContext.scope = [];
        this.validationContext.isValid = true;

        // const valuesScope = fromProxy(autoCreateProxy(values), this.scope((f: TModel) => f));
        const valuesScope = this.scope((f: TModel) => f)(values);
        const errorsCollection = this.validator(valuesScope);
        forEachElement(errorsCollection, ({ selector, scope, errors }) => {
            if (isArray(scope) && scope.length > 0) {
                this.validationContext.scope.push(...scope);
                this.validationContext.isValid = false;
            }
            if (isArray(errors) && errors.length > 0 && selector) {
                const validationError = fromProxy(autoCreateProxy(validation.errors), this.scope(selector), []);
                setPathValue(
                    [...validationError, ...errors],
                    this.scope(selector),
                    validation.errors
                );
                this.validationContext.isValid = false;
            }
        });
        validation.isValid = validation.isValid && this.validationContext.isValid;
    }

    /**
     * Validation function that accepts [[FormContext]] and validate [[Form]] `model`
     */
    private *validator(model: TModel): IterableIterator<IValidationErrors> {
        const props = getProps(this.props);
        const state = this.state;
        const { errors, validator, configure: config } = props;

        if (!model || !validator) {
            return;
        }

        if (errors) {
            yield* errors;
        }
        if (isYup(validator)) {
            yield* yupValidator(validator, model, { state, props }, config);
        } else {
            yield* validator.validate(model, { state, props, config });
        }
    }
    private mountValidation = (value: Validation<TModel>) => {
        this.validators.push(value);
    }
    private unMountValidation = (value: Validation<TModel>) => {
        const id = this.validators.indexOf(value);
        if (id > -1) {
            this.validators.splice(id, 1);
        }
    }
}

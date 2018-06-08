import * as React from "react";
import { isArray } from "util";
import * as Yup from "yup";

import { IValidator } from "../ArrayValidator";
import { IErrorMessage } from "../FormValidator";
import { getProps, yupValidator } from "../helpers/validation";
import { IValidationConfiguration, IValidationErrors, IValidationMeta, IValidationState, ValidationModel } from "../interfaces/validation";
import { autoCreateProxy, forEachElement, fromProxy, isYup, setPathValue } from "../tools";
import { Consumer as FormContext } from "./Form";

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

const NoErrors: ValidationModel<{}> = {} as any;
const NoScopeErrors: Array<IErrorMessage<any>> = [];

export const { Provider, Consumer } = React.createContext<IValidationContext<any>>({
    validation: {
        errors: NoErrors,
        scope: NoScopeErrors,
        isValid: true
    }
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
        configure: {}
    };
    validationState: IValidationState<T>;
    private validators: Array<Validation<T>> = [];
    private _context: IValidationContext<T> | undefined;
    constructor(props) {
        super(props);
        this.validator = this.validator.bind(this);
    }
    validate = (values: T) => {
        this.validationState = {
            errors: {} as any,
            scope: [],
            isValid: this.props.isValid
        };

        const errorsCollection = this.validator(values);
        forEachElement(errorsCollection, ({ selector, scope, errors }) => {
            if (scope) {
                this.validationState.scope.push(...scope);
                this.validationState.isValid = scope.length === 0 && this.validationState.isValid;
            }
            if (isArray(errors) && selector) {
                const validationError = fromProxy(autoCreateProxy(this.validationState.errors), selector, []);
                setPathValue(
                    [...validationError, ...errors],
                    selector,
                    this.validationState.errors
                );
                this.validationState.isValid = false;
            }
        });
        return this.validationState;
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
                                validation: this._context
                                    ? validationContext.validation
                                    : this.validate(formContext.storage.values as T),
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
    *validator(model: T): IterableIterator<IValidationErrors> {
        const props = getProps(this.props);
        const { validator, scopeValidator } = props;

        if (!model || (!validator && !scopeValidator)) {
            return;
        }

        if (this.props.errors) {
            yield* this.props.errors.values();
        } else {
            yield* this.generator(validator, scopeValidator, model, props, this.state);
        }

        for (const _validator of this.validators) {
            yield* _validator.validator(model);
        }
    }
    private *generator(
        validator: IValidator<T, IValidationErrors, IValidationMeta<T>> | Yup.Schema<T>,
        scopeValidator: IValidator<T, IValidationErrors, IValidationMeta<T>>,
        model: T,
        props: IValidationProps<T>,
        state
    ): IterableIterator<IValidationErrors> {
        if (validator) {
            if (isYup(validator)) {
                yield* yupValidator(validator, model, { state, props }, props.configure);
            } else {
                yield* validator.validate(model, { state, props });
            }
        }
        if (scopeValidator) {
            yield* scopeValidator.validate(model, { state, props });
        }
    }
    private mountValidation = (value: Validation<T>) => {
        this.validators.push(value);
    }
    private unMountValidation = (value: Validation<T>) => {
        const id = this.validators.indexOf(value);
        if (id > -1) {
            this.validators.splice(id, 1);
        }
    }
}

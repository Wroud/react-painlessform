import * as React from "react";
import { isArray } from "util";
import * as Yup from "yup";

import { IValidator } from "../ArrayValidator";
import { IErrorMessage } from "../FormValidator";
import { createFormFactory } from "../helpers/formFactory";
import { yupValidator } from "../helpers/validation";
import { IFormStorage } from "../interfaces/form";
import { IValidationErrors, IValidationMeta, IValidatorConfig, IValidatorState } from "../interfaces/validation";
import { Path } from "../Path";
import { forEachElement, isYup } from "../tools";

/**
 * Describes [[Validation]] props
 */
export interface IValidationProps<T> {
    /**
     * You can pass own errors via [[ValidationContext]]
     */
    errors?: Array<IValidationErrors<T>>;
    isValid?: boolean;
    /**
     * Function or `Yup.Schema` object that accepts form values and returns errors
     */
    validator?: IValidator<T, IValidationErrors<T>, IValidationMeta<T>> | Yup.Schema<T>;
    /**
     * Via this prop you can configure `Yup` validation
     */
    configure?: IValidatorConfig & Yup.ValidateOptions;
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

export const { Provider, Consumer } = React.createContext<IValidationContext<any>>({
    scope: {} as any,
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
export class Validation<TModel extends object> extends React.Component<IValidationProps<TModel>, IValidatorState> {
    static defaultProps: IValidationProps<any> = {
        isValid: true,
        configure: {}
    };
    private validationContext: IValidationContext<TModel>;
    private validators: Array<Validation<TModel>> = [];
    private _context: IValidationContext<TModel> | undefined;
    private scope = Path.root<any>() as Path<any, TModel>;

    constructor(props: IValidationProps<TModel>) {
        super(props);
        this.validator = this.validator.bind(this);
        this.validationContext = {
            scope: [],
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
        if (this._context && this._context.mountValidation) {
            this._context.mountValidation(this);
        }
    }
    componentWillUnmount() {
        if (this._context && this._context.unMountValidation) {
            this._context.unMountValidation(this);
        }
    }

    private validate = ({ values, validation }: IFormStorage<any>) => {
        this.validationContext.scope = [];
        this.validationContext.isValid = true;

        const valuesScope = this.scope.getValue(values);
        const errorsCollection = this.validator(valuesScope);
        forEachElement(errorsCollection, ({ selector, scope, errors }) => {
            if (isArray(scope) && scope.length > 0) {
                this.validationContext.scope.push(...scope);
                this.validationContext.isValid = false;
            }
            if (isArray(errors) && errors.length > 0 && selector) {
                const scopedSelector = this.scope.join(selector);
                const validationError = scopedSelector.getValue(validation.errors, []);
                scopedSelector.setValueImmutable(validation.errors, [...validationError, ...errors]);
                this.validationContext.isValid = false;
            }
        });
        validation.isValid = validation.isValid && this.validationContext.isValid;
    }

    /**
     * Validation function that accepts [[FormContext]] and validate [[Form]] `model`
     */
    private *validator(model?: TModel): IterableIterator<IValidationErrors<TModel>> {
        const props = this.props;
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
            yield* validator.validate(model, { state, props, config: config as any });
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

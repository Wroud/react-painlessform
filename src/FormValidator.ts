import * as Yup from "yup";
import { IValidator, Validator } from "./ArrayValidator";
import { isYup, mergeFormErrors } from "./tools";

export interface IErrorMessage<T = {}> {
    message: string;
    meta?: T;
}

export type FormErrors<T> = {
    [P in keyof T]: Array<IErrorMessage<any>>;
};

export class FormValidator<TSource, TMeta = {}> implements IValidator<TSource, FormErrors<TSource>, TMeta> {
    private validators: Array<IValidator<TSource, FormErrors<TSource>, TMeta> | Yup.Schema<any>>;

    constructor(...validators: Array<IValidator<TSource, FormErrors<TSource>, TMeta> | Yup.Schema<any>>) {
        this.validators = validators;
    }

    validate = (data: TSource, meta: TMeta) => {
        let errors = {};
        this.validators.forEach(validator => {
            if (isYup(validator)) {
                try {
                    validator.validateSync(data, {
                        abortEarly: false,
                        context: meta || {}
                    });
                } catch (_errors) {
                    const __errors: Yup.ValidationError = _errors;
                    if (__errors.path === undefined) {
                        __errors.inner.forEach(error => {
                            errors = mergeFormErrors(errors, {
                                [error.path]: error.errors.map(message => ({ message }))
                            });
                        });
                    }
                }
            } else {
                errors = mergeFormErrors(errors, validator.validate(data, meta));
            }
        });
        return errors as FormErrors<TSource>;
    }
}

export function createFormValidator<TSource, TMeta = {}>(
    ...validators: Array<IValidator<TSource, FormErrors<TSource>, TMeta> | Yup.Schema<any>>
): IValidator<TSource, FormErrors<TSource>, TMeta> {
    return new FormValidator(...validators);
}

export function createRawFormValidator<TSource, TMeta = {}>(
    validator: Validator<TSource, FormErrors<TSource>, TMeta>
): IValidator<TSource, FormErrors<TSource>, TMeta> {
    return { validate: validator };
}

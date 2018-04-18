import * as Yup from "yup";
import { IValidator, Validator } from "./ArrayValidator";
import { mergeFormErrors } from "./tools";

export type FormErrors<T> = {
    [P in keyof T]: string[];
};

export class FormValidator<TSource, TMeta = {}> implements IValidator<TSource, FormErrors<TSource>, TMeta> {
    private validators: Array<IValidator<TSource, FormErrors<TSource>, TMeta> | Yup.Schema<any>>;

    constructor(...validators: Array<IValidator<TSource, FormErrors<TSource>, TMeta> | Yup.Schema<any>>) {
        this.validators = validators;
    }

    validate = (data: TSource, meta: TMeta) => {
        let errors = {};
        this.validators.forEach(validator => {
            if ((validator as Yup.Schema<any>).validateSync) {
                try {
                    (validator as Yup.Schema<any>).validateSync(data, {
                        abortEarly: false,
                        context: meta || {},
                    });
                } catch (_errors) { // : Yup.ValidationError
                    if (_errors.path === undefined) {
                        _errors.inner.forEach(error => {
                            errors = mergeFormErrors(errors, { [error.path]: error.errors });
                        });
                    }//  else {
                    // this.context = _errors.errors;
                    // }
                }
            } else {
                errors = mergeFormErrors(errors, (validator as IValidator<TSource, FormErrors<TSource>, TMeta>).validate(data, meta));
            }
        });
        return errors as FormErrors<TSource>;
    }
}

export function createFormValidator<TSource, TMeta = {}>(
    ...validators: Array<IValidator<TSource, FormErrors<TSource>, TMeta> | Yup.Schema<any>>,
): IValidator<TSource, FormErrors<TSource>, TMeta> {
    return new FormValidator(...validators);
}

export function createRawFormValidator<TSource, TMeta = {}>(
    validator: Validator<TSource, FormErrors<TSource>, TMeta>,
): IValidator<TSource, FormErrors<TSource>, TMeta> {
    return { validate: validator };
}

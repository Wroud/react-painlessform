import { IValidator, Validator } from "./ArrayValidator";
import { mergeFormErrors } from "./tools";

export type FormErrors<T> = {
    [P in keyof T]: string[];
};

export class FormValidator<TSource, TMeta = {}> implements IValidator<TSource, FormErrors<TSource>, TMeta> {
    private validators: Array<IValidator<TSource, FormErrors<TSource>, TMeta>>;

    constructor(...validators: Array<IValidator<TSource, FormErrors<TSource>, TMeta>>) {
        this.validators = validators;
    }

    validate = (data: TSource, meta: TMeta) => {
        let errors = {};
        this.validators.forEach(validator => {
            errors = mergeFormErrors(errors, validator.validate(data, meta));
        });
        return errors as FormErrors<TSource>;
    }
}

export function createFormValidator<TSource, TMeta = {}>(
    ...validators: Array<IValidator<TSource, FormErrors<TSource>, TMeta>>,
): IValidator<TSource, FormErrors<TSource>, TMeta> {
    return new FormValidator(...validators);
}

export function createRawFormValidator<TSource, TMeta = {}>(
    validator: Validator<TSource, FormErrors<TSource>, TMeta>,
): IValidator<TSource, FormErrors<TSource>, TMeta> {
    return { validate: validator };
}

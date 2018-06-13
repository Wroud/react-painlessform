import * as Yup from "yup";
import { IValidator, Validator } from "./ArrayValidator";
import { yupValidator } from "./helpers/validation";
import { IValidationErrors } from "./interfaces/validation";
import { isYup } from "./tools";

export interface IErrorMessage<T = {}> {
    message: string;
    meta?: T;
}

export class FormValidator<TModel, TMeta = {}> implements IValidator<TModel, IValidationErrors<TModel>, TMeta> {
    private validators: Array<IValidator<TModel, IValidationErrors<TModel>, TMeta> | Yup.Schema<any>>;

    constructor(...validators: Array<IValidator<TModel, IValidationErrors<TModel>, TMeta> | Yup.Schema<any>>) {
        this.validators = validators;
    }

    *validate(data: TModel, meta?: TMeta) {
        for (const validator of this.validators) {
            if (isYup(validator)) {
                yield* yupValidator<TModel>(validator, data, meta || {});
            } else {
                yield* validator.validate(data, meta);
            }
        }
    }
}

export function createFormValidator<TModel, TMeta = {}>(
    ...validators: Array<IValidator<TModel, IValidationErrors<TModel>, TMeta> | Yup.Schema<any>>
) {
    return new FormValidator(...validators);
}

export function createRawFormValidator<TModel, TMeta = {}>(
    validator: Validator<TModel, IterableIterator<IValidationErrors<TModel>>, TMeta>
) {
    return { validate: validator };
}

import * as Yup from "yup";
import { IValidator, Validator } from "./ArrayValidator";
import { IValidationErrors } from "./interfaces/validation";
export interface IErrorMessage<T = {}> {
    message: string;
    meta?: T;
}
export declare class FormValidator<TModel, TMeta = {}> implements IValidator<TModel, IValidationErrors<TModel>, TMeta> {
    private validators;
    constructor(...validators: Array<IValidator<TModel, IValidationErrors<TModel>, TMeta> | Yup.Schema<any>>);
    validate(data: TModel, meta?: TMeta): IterableIterator<IValidationErrors<TModel>>;
}
export declare function createFormValidator<TModel, TMeta = {}>(...validators: Array<IValidator<TModel, IValidationErrors<TModel>, TMeta> | Yup.Schema<any>>): FormValidator<TModel, TMeta>;
export declare function createRawFormValidator<TModel, TMeta = {}>(validator: Validator<TModel, IterableIterator<IValidationErrors<TModel>>, TMeta>): {
    validate: Validator<TModel, IterableIterator<IValidationErrors<TModel>>, TMeta>;
};

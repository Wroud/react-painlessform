import { IValidator, Validator } from "./ArrayValidator";
export declare type FormErrors<T> = {
    [P in keyof T]: string[];
};
export declare class FormValidator<TSource, TMeta = {}> implements IValidator<TSource, FormErrors<TSource>, TMeta> {
    private validators;
    constructor(...validators: Array<IValidator<TSource, FormErrors<TSource>, TMeta>>);
    validate: (data: TSource, meta: TMeta) => FormErrors<TSource>;
}
export declare function createFormValidator<TSource, TMeta = {}>(...validators: Array<IValidator<TSource, FormErrors<TSource>, TMeta>>): IValidator<TSource, FormErrors<TSource>, TMeta>;
export declare function createRawFormValidator<TSource, TMeta = {}>(validator: Validator<TSource, FormErrors<TSource>, TMeta>): IValidator<TSource, FormErrors<TSource>, TMeta>;

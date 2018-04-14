import { IValidator } from "./Validator";
export declare type FormErrors<T> = {
    [P in keyof T]: string[];
};
export declare class FormValidator<TSource> implements IValidator<TSource, FormErrors<TSource>> {
    private validator;
    constructor(validator: IValidator<TSource, any>);
    validate: (data: TSource, state?: any, props?: any) => FormErrors<TSource>;
}
export declare const createFormValidator: <TSource>(validator: IValidator<TSource, any>) => IValidator<TSource, FormErrors<TSource>>;

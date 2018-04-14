import { ArrayValidator, IValidator, Validator } from "./Validator";
export interface IFieldErrors {
    [key: string]: string[];
}
export declare class FieldValidator<TSource, TValue> implements IValidator<TSource, IFieldErrors> {
    private name;
    private validator;
    private map;
    constructor(name: keyof TSource, validator: IValidator<TValue, string[]>, map?: (source: TSource) => TValue | TSource[keyof TSource]);
    validate: (data: TSource, state?: any, props?: any) => IFieldErrors;
}
export declare function createRawFormValidator<TSource>(validator: Validator<TSource, IFieldErrors>): IValidator<TSource, IFieldErrors>;
export declare function createFieldValidator<TSource, TValue>(name: keyof TSource, validator: IValidator<TValue, string[]>, map?: (source: TSource) => TValue): IValidator<TSource, IFieldErrors>;
export declare function createFieldValidatorFactory<TSource, TValue>(name: keyof TSource, validator: ArrayValidator<TValue, string>, map?: (source: TSource) => TValue): () => FieldValidator<TSource, TValue>;
export declare function combineFieldValidators<TSource>(...validators: Array<IValidator<TSource, IFieldErrors>>): IValidator<TSource, IFieldErrors>;

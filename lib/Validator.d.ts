export declare type Validator<TValue, TError> = (data: TValue, state?, props?) => TError;
export interface IValidator<TValue, TError> {
    validate: (data: TValue, state?, props?) => TError;
}
export declare type ValidatorFactory<T, TError> = () => IValidator<T, TError>;
export declare class ArrayValidator<T, TError> implements IValidator<T, TError[] | TError> {
    private name;
    private validator;
    constructor(name: string, validator: Validator<T, TError[] | TError>);
    validate: (data: T, state: any, props: any) => TError[];
}
export declare const createValidator: <T>(name: string, validator: Validator<T, string | string[]>) => IValidator<T, string[]>;
export declare const createValidatorFactory: <T>(name: string, validator: Validator<T, string | string[]>) => () => ArrayValidator<T, string>;
export declare function combineValidators<TValue, TError>(...validators: Array<IValidator<TValue, TError[]>>): IValidator<TValue, TError[]>;

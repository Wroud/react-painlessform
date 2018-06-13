export declare type Validator<TValue, TError, TMeta = {}> = (data: TValue, meta?: TMeta) => TError;
export interface IValidator<TValue, TError, TMeta = {}> {
    validate: Validator<TValue, IterableIterator<TError>, TMeta>;
}
export declare class ArrayValidator<TValue, TError, TMeta = {}> implements IValidator<TValue, TError, TMeta> {
    private validators;
    constructor(name: string, validators: Array<Validator<TValue, TError[], TMeta>>);
    validate(data: any, meta?: any): IterableIterator<TError>;
}
export declare function createValidator<TValue, TMeta = {}>(name: string, ...validator: Array<Validator<TValue, string[], TMeta>>): ArrayValidator<TValue, string, TMeta>;

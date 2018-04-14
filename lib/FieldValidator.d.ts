import { IValidator } from "./ArrayValidator";
export interface IFieldErrors {
    [key: string]: string[];
}
export declare class FieldValidator<TSource, TValue, TMeta = {}> implements IValidator<TSource, IFieldErrors, TMeta> {
    private name;
    private validator;
    private map;
    constructor(name: keyof TSource, validator: IValidator<TValue, string[], TMeta>, map?: (source: TSource) => TValue | TSource[keyof TSource]);
    validate(data: TSource, meta: TMeta): IFieldErrors;
}
export declare function createFieldValidator<TSource, TValue, TMeta = {}>(name: keyof TSource, validator: IValidator<TValue, string[], TMeta>, map?: (source: TSource) => TValue): IValidator<TSource, IFieldErrors, TMeta>;

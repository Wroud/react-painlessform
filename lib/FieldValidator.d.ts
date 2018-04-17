import { IValidator } from "./ArrayValidator";
import { FormErrors } from "./FormValidator";
export declare class FieldValidator<TSource, TValue, TMeta = {}> implements IValidator<TSource, FormErrors<TSource>, TMeta> {
    private name;
    private validator;
    private selectValue;
    constructor(name: keyof TSource, validator: IValidator<TValue | TSource[keyof TSource], string[], TMeta>, selectValue?: (source: TSource) => TValue | TSource[keyof TSource]);
    validate(data: TSource, meta: TMeta): FormErrors<TSource>;
}
export declare function createFieldValidator<TSource, TValue, TMeta = {}>(name: keyof TSource, validator: IValidator<TValue | TSource[keyof TSource], string[], TMeta>, seelctValue?: (source: TSource) => TValue | TSource[keyof TSource]): IValidator<TSource, FormErrors<TSource>, TMeta>;

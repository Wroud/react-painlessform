import { IValidator } from "./ArrayValidator";
import { ModelFieldSelector } from "./interfaces/field";
import { IValidationErrors } from "./interfaces/validation";
export declare class FieldValidator<TModel, TValue, TMeta = {}> implements IValidator<TModel, IValidationErrors, TMeta> {
    private field;
    private validator;
    constructor(field: ModelFieldSelector<TModel, TValue>, validator: IValidator<TValue, string, TMeta>);
    validate(data: TModel, meta?: TMeta): IterableIterator<IValidationErrors>;
}
export declare function createFieldValidator<TModel, TValue, TMeta = {}>(field: ModelFieldSelector<TModel, TValue>, validator: IValidator<TValue, string, TMeta>): FieldValidator<TModel, TValue, TMeta>;

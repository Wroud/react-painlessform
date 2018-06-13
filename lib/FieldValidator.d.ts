import { IValidator } from "./ArrayValidator";
import { IErrorMessage } from "./FormValidator";
import { IValidationErrors } from "./interfaces/validation";
import { Path } from "./Path";
export declare class FieldValidator<TModel, TValue, TMeta = {}> implements IValidator<TModel, IValidationErrors<TModel>, TMeta> {
    private field;
    private validator;
    constructor(field: (values: TModel) => TValue, validator: IValidator<TValue, string, TMeta>);
    validate(data: TModel, meta?: TMeta): IterableIterator<{
        selector: Path<TModel, TValue>;
        errors: IErrorMessage<TMeta>[];
    }>;
}
export declare function createFieldValidator<TModel, TValue, TMeta = {}>(field: (values: TModel) => TValue, validator: IValidator<TValue, string, TMeta>): FieldValidator<TModel, TValue, TMeta>;

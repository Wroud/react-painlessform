import { IValidator } from "./ArrayValidator";
import { IErrorMessage } from "./FormValidator";
import { ModelFieldSelector } from "./interfaces/field";
import { IValidationErrors } from "./interfaces/validation";
import { forEachElement } from "./tools";

export class FieldValidator<TModel, TValue, TMeta = {}>
    implements IValidator<TModel, IValidationErrors, TMeta> {

    private field: ModelFieldSelector<TModel, TValue>;
    private validator: IValidator<TValue, string, TMeta>;

    constructor(
        field: ModelFieldSelector<TModel, TValue>,
        validator: IValidator<TValue, string, TMeta>
    ) {
        this.field = field;
        this.validator = validator;
        this.validate = this.validate.bind(this);
    }

    *validate(data: TModel, meta?: TMeta) {
        if (data === undefined || this.field(data) === undefined) {
            return;
        }
        const iterator = this.validator.validate(this.field(data), meta);
        const errors: Array<IErrorMessage<TMeta>> = [];
        forEachElement(iterator, message => errors.push({ message }));
        yield {
            selector: this.field as any,
            errors
        } as IValidationErrors;
    }
}

export function createFieldValidator<TModel, TValue, TMeta = {}>(
    field: ModelFieldSelector<TModel, TValue>,
    validator: IValidator<TValue, string, TMeta>
) {
    return new FieldValidator(field, validator);
}

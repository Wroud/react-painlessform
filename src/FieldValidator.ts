import { IValidator } from "./ArrayValidator";
import { IErrorMessage } from "./FormValidator";
import { IValidationErrors } from "./interfaces/validation";
import { Path } from "./Path";
import { forEachElement } from "./tools";

export class FieldValidator<TModel, TValue, TMeta = {}>
    implements IValidator<TModel, IValidationErrors<TModel>, TMeta> {

    private field: Path<TModel, TValue>;
    private validator: IValidator<TValue, string, TMeta>;

    constructor(
        field: (values: TModel) => TValue,
        validator: IValidator<TValue, string, TMeta>
    ) {
        this.field = Path.fromSelector(field);
        this.validator = validator;
        this.validate = this.validate.bind(this);
    }

    *validate(data: TModel, meta?: TMeta) {
        const value = this.field.getValue(data);
        if (data === undefined || value === undefined) {
            return;
        }
        const iterator = this.validator.validate(value, meta);
        const errors: Array<IErrorMessage<TMeta>> = [];
        forEachElement(iterator, message => errors.push({ message }));
        yield {
            selector: this.field,
            errors
        };
    }
}

export function createFieldValidator<TModel, TValue, TMeta = {}>(
    field: (values: TModel) => TValue,
    validator: IValidator<TValue, string, TMeta>
) {
    return new FieldValidator(field, validator);
}

import { ArrayValidator, IValidator, Validator } from "./ArrayValidator";
import { mergeFormErrors, reduce } from "./tools";

export interface IFieldErrors {
    [key: string]: string[];
}

export class FieldValidator<TSource, TValue, TMeta = {}> implements IValidator<TSource, IFieldErrors, TMeta> {
    private name: keyof TSource;
    private validator: IValidator<TValue | TSource[keyof TSource], string[], TMeta>;
    private map: (source: TSource) => TValue | TSource[keyof TSource];

    constructor(
        name: keyof TSource,
        validator: IValidator<TValue, string[], TMeta>,
        map?: (source: TSource) => TValue | TSource[keyof TSource],
    ) {
        this.name = name;
        this.map = map || (data => data[name]);
        this.validator = validator;
        this.validate = this.validate.bind(this);
    }

    validate(data: TSource, meta: TMeta): IFieldErrors {
        if (this.map(data) === undefined) {
            return {};
        }
        return {
            [this.name]: this.validator.validate(this.map(data), meta),
        };
    }
}

export function createRawFormValidator<TSource, TMeta = {}>(
    validator: Validator<TSource, IFieldErrors, TMeta>,
): IValidator<TSource, IFieldErrors, TMeta> {
    return { validate: validator };
}
export function createFieldValidator<TSource, TValue, TMeta = {}>(
    name: keyof TSource,
    validator: IValidator<TValue, string[], TMeta>,
    map?: (source: TSource) => TValue,
): IValidator<TSource, IFieldErrors, TMeta> {
    return new FieldValidator(name, validator, map);
}

import { mergeFormErrors, reduce } from "./tools";
import { ArrayValidator, IValidator, Validator } from "./Validator";

export interface IFieldErrors {
    [key: string]: string[];
}

export class FieldValidator<TSource, TValue> implements IValidator<TSource, IFieldErrors> {
    private name: keyof TSource;
    private validator: IValidator<TValue | TSource[keyof TSource], string[]>;
    private map: (source: TSource) => TValue | TSource[keyof TSource];

    constructor(
        name: keyof TSource,
        validator: IValidator<TValue, string[]>,
        map?: (source: TSource) => TValue | TSource[keyof TSource],
    ) {
        this.name = name;
        this.map = map || (data => data[name]);
        this.validator = validator;
    }

    validate = (data: TSource, state?, props?): IFieldErrors => {
        if (this.map(data) === undefined) {
            return {};
        }
        return {
            [this.name]: this.validator.validate(this.map(data), state, props),
        };
    }
}

// export function createFieldValidator<TSource, TValue = keyof TSource>(
//     name: TValue,
//     validator: Validator<TValue, string>,
// );
export function createRawFormValidator<TSource>(
    validator: Validator<TSource, IFieldErrors>,
): IValidator<TSource, IFieldErrors> {
    return { validate: validator };
}
export function createFieldValidator<TSource, TValue>(
    name: keyof TSource,
    validator: IValidator<TValue, string[]>,
    map?: (source: TSource) => TValue,
): IValidator<TSource, IFieldErrors> {
    return new FieldValidator(name, validator, map);
}

export function createFieldValidatorFactory<TSource, TValue>(
    name: keyof TSource,
    validator: ArrayValidator<TValue, string>,
    map?: (source: TSource) => TValue,
) {
    return () => new FieldValidator(name, validator, map);
}

export function combineFieldValidators<TSource>(
    ...validators: Array<IValidator<TSource, IFieldErrors>>,
): IValidator<TSource, IFieldErrors> {
    return {
        validate: (model, state, props) => {
            let errors = {};
            validators.forEach(validator => {
                errors = mergeFormErrors(errors, validator.validate(model, state, props));
            });
            return errors;
        },
    };
}

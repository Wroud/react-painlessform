export type Validator<TValue, TError, TMeta = {}> = (data: TValue, meta?: TMeta) => TError;

export interface IValidator<TValue, TError, TMeta = {}> {
    validate(data: TValue, meta?: TMeta): TError;
}

export class ArrayValidator<TValue, TError, TMeta = {}> implements IValidator<TValue, TError[] | TError, TMeta> {
    private name: string;
    private validators: Array<Validator<TValue, TError[] | TError, TMeta>>;

    constructor(name: string, validators: Array<Validator<TValue, TError[] | TError, TMeta>>) {
        this.name = name;
        this.validators = validators;
        this.validate = this.validate.bind(this);
    }

    validate(data, meta) {
        let errors = [];
        if (data === undefined) {
            return errors;
        }
        this.validators.forEach(validator => {
            const validatorErrors = validator(data, meta);
            errors = Array.isArray(validatorErrors)
                ? [...errors, ...validatorErrors]
                : [...errors, validatorErrors];
        });
        return errors;
    }
}

export function createValidator<TValue, TMeta = {}>(
    name: string,
    ...validator: Array<Validator<TValue, string | string[], TMeta>>
): IValidator<TValue, string[], TMeta> {
    return new ArrayValidator(name, validator);
}

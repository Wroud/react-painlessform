export type Validator<TValue, TError, TMeta = {}> = (data: TValue, meta?: TMeta) => TError;

export interface IValidator<TValue, TError, TMeta = {}> {
    validate: Validator<TValue, IterableIterator<TError>, TMeta>;
}

export class ArrayValidator<TValue, TError, TMeta = {}> implements IValidator<TValue, TError, TMeta> {
    private name: string;
    private validators: Array<Validator<TValue, TError[], TMeta>>;

    constructor(name: string, validators: Array<Validator<TValue, TError[], TMeta>>) {
        this.name = name;
        this.validators = validators;
        this.validate = this.validate.bind(this);
    }

    *validate(data, meta?) {
        if (data === undefined) {
            return;
        }
        for (const validator of this.validators) {
            yield* validator(data, meta);
        }
    }
}

export function createValidator<TValue, TMeta = {}>(
    name: string,
    ...validator: Array<Validator<TValue, string[], TMeta>>
) {
    return new ArrayValidator(name, validator);
}

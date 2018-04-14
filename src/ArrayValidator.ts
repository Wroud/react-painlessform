import { concat } from "./tools";

export type Validator<TValue, TError> = (data: TValue, state?, props?) => TError;

export interface IValidator<TValue, TError> {
    validate: (data: TValue, state?, props?) => TError;
}

export type ValidatorFactory<T, TError> = () => IValidator<T, TError>;

export class ArrayValidator<T, TError> implements IValidator<T, TError[] | TError> {
    private name: string;
    private validator: Validator<T, TError[] | TError>;

    constructor(name: string, validator: Validator<T, TError[] | TError>) {
        this.name = name;
        this.validator = validator;
    }

    validate = (data: T, state, props): TError[] => {
        const errors = this.validator(data, state, props);
        if (Array.isArray(errors)) {
            return errors;
        } else {
            return [errors];
        }
    }
}

export const createValidator =
    <T>(name: string, validator: Validator<T, string | string[]>): IValidator<T, string[]> =>
        new ArrayValidator(name, validator);

export const createValidatorFactory =
    <T>(name: string, validator: Validator<T, string | string[]>) =>
        () => new ArrayValidator(name, validator);

export function combineValidators<TValue, TError>(
    ...validators: Array<IValidator<TValue, TError[]>>,
): IValidator<TValue, TError[]> {
    return {
        validate: concat(...validators.map(validator => validator.validate)),
    };
}

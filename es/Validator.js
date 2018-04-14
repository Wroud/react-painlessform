import { concat } from "./tools";
export class ArrayValidator {
    constructor(name, validator) {
        this.validate = (data, state, props) => {
            const errors = this.validator(data, state, props);
            if (Array.isArray(errors)) {
                return errors;
            }
            else {
                return [errors];
            }
        };
        this.name = name;
        this.validator = validator;
    }
}
export const createValidator = (name, validator) => new ArrayValidator(name, validator);
export const createValidatorFactory = (name, validator) => () => new ArrayValidator(name, validator);
export function combineValidators(...validators) {
    return {
        validate: concat(...validators.map(validator => validator.validate)),
    };
}

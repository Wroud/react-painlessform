import { mergeFormErrors } from "./tools";
export class FieldValidator {
    constructor(name, validator, map) {
        this.validate = (data, state, props) => {
            if (this.map(data) === undefined) {
                return {};
            }
            return {
                [this.name]: this.validator.validate(this.map(data), state, props),
            };
        };
        this.name = name;
        this.map = map || (data => data[name]);
        this.validator = validator;
    }
}
export function createRawFormValidator(validator) {
    return { validate: validator };
}
export function createFieldValidator(name, validator, map) {
    return new FieldValidator(name, validator, map);
}
export function createFieldValidatorFactory(name, validator, map) {
    return () => new FieldValidator(name, validator, map);
}
export function combineFieldValidators(...validators) {
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

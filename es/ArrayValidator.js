"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArrayValidator {
    constructor(name, validators) {
        this.name = name;
        this.validators = validators;
        this.validate = this.validate.bind(this);
    }
    validate(data, meta) {
        let errors = [];
        this.validators.forEach(validator => {
            const validatorErrors = validator(data, meta);
            errors = Array.isArray(validatorErrors)
                ? [...errors, ...validatorErrors]
                : [...errors, validatorErrors];
        });
        return errors;
    }
}
exports.ArrayValidator = ArrayValidator;
function createValidator(name, ...validator) {
    return new ArrayValidator(name, validator);
}
exports.createValidator = createValidator;

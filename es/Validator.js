"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("./tools");
class ArrayValidator {
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
exports.ArrayValidator = ArrayValidator;
exports.createValidator = (name, validator) => new ArrayValidator(name, validator);
exports.createValidatorFactory = (name, validator) => () => new ArrayValidator(name, validator);
function combineValidators(...validators) {
    return {
        validate: tools_1.concat(...validators.map(validator => validator.validate)),
    };
}
exports.combineValidators = combineValidators;

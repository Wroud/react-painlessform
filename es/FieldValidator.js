"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("./tools");
class FieldValidator {
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
exports.FieldValidator = FieldValidator;
function createRawFormValidator(validator) {
    return { validate: validator };
}
exports.createRawFormValidator = createRawFormValidator;
function createFieldValidator(name, validator, map) {
    return new FieldValidator(name, validator, map);
}
exports.createFieldValidator = createFieldValidator;
function createFieldValidatorFactory(name, validator, map) {
    return () => new FieldValidator(name, validator, map);
}
exports.createFieldValidatorFactory = createFieldValidatorFactory;
function combineFieldValidators(...validators) {
    return {
        validate: (model, state, props) => {
            let errors = {};
            validators.forEach(validator => {
                errors = tools_1.mergeFormErrors(errors, validator.validate(model, state, props));
            });
            return errors;
        },
    };
}
exports.combineFieldValidators = combineFieldValidators;

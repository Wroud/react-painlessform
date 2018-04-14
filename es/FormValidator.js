"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FormValidator {
    constructor(validator) {
        this.validate = (data, state, props) => {
            return this.validator.validate(data, state, props);
        };
        this.validator = validator;
    }
}
exports.FormValidator = FormValidator;
exports.createFormValidator = (validator) => new FormValidator(validator);

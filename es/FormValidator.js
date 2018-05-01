"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("./tools");
class FormValidator {
    constructor(...validators) {
        this.validate = (data, meta) => {
            let errors = {};
            this.validators.forEach(validator => {
                if (tools_1.isYup(validator)) {
                    try {
                        validator.validateSync(data, {
                            abortEarly: false,
                            context: meta || {}
                        });
                    }
                    catch (_errors) {
                        const __errors = _errors;
                        if (__errors.path === undefined) {
                            __errors.inner.forEach(error => {
                                errors = tools_1.mergeFormErrors(errors, {
                                    [error.path]: error.errors.map(message => ({ message }))
                                });
                            });
                        }
                    }
                }
                else {
                    errors = tools_1.mergeFormErrors(errors, validator.validate(data, meta));
                }
            });
            return errors;
        };
        this.validators = validators;
    }
}
exports.FormValidator = FormValidator;
function createFormValidator(...validators) {
    return new FormValidator(...validators);
}
exports.createFormValidator = createFormValidator;
function createRawFormValidator(validator) {
    return { validate: validator };
}
exports.createRawFormValidator = createRawFormValidator;

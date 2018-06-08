"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("./helpers/validation");
const tools_1 = require("./tools");
class FormValidator {
    constructor(...validators) {
        this.validators = validators;
    }
    *validate(data, meta) {
        for (const validator of this.validators) {
            if (tools_1.isYup(validator)) {
                yield* validation_1.yupValidator(validator, data, meta || {});
            }
            else {
                yield* validator.validate(data, meta);
            }
        }
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

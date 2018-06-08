"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("./tools");
class FieldValidator {
    constructor(field, validator) {
        this.field = field;
        this.validator = validator;
        this.validate = this.validate.bind(this);
    }
    *validate(data, meta) {
        if (data === undefined || this.field(data) === undefined) {
            return;
        }
        const iterator = this.validator.validate(this.field(data), meta);
        const errors = [];
        tools_1.forEachElement(iterator, message => errors.push({ message }));
        yield {
            selector: this.field,
            errors
        };
    }
}
exports.FieldValidator = FieldValidator;
function createFieldValidator(field, validator) {
    return new FieldValidator(field, validator);
}
exports.createFieldValidator = createFieldValidator;

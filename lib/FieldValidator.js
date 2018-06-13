"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path_1 = require("./Path");
const tools_1 = require("./tools");
class FieldValidator {
    constructor(field, validator) {
        this.field = Path_1.Path.fromSelector(field);
        this.validator = validator;
        this.validate = this.validate.bind(this);
    }
    *validate(data, meta) {
        const value = this.field.getValue(data);
        if (data === undefined || value === undefined) {
            return;
        }
        const iterator = this.validator.validate(value, meta);
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
//# sourceMappingURL=FieldValidator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FieldValidator {
    constructor(name, validator, selectValue) {
        this.name = name;
        this.selectValue = selectValue || (data => data[name]);
        this.validator = validator;
        this.validate = this.validate.bind(this);
    }
    validate(data, meta) {
        if (data === undefined || this.selectValue(data) === undefined) {
            return {};
        }
        return {
            [this.name]: this.validator.validate(this.selectValue(data), meta),
        };
    }
}
exports.FieldValidator = FieldValidator;
function createFieldValidator(name, validator, seelctValue) {
    return new FieldValidator(name, validator, seelctValue);
}
exports.createFieldValidator = createFieldValidator;

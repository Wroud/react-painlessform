"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FieldValidator {
    constructor(name, validator, map) {
        this.name = name;
        this.map = map || (data => data[name]);
        this.validator = validator;
        this.validate = this.validate.bind(this);
    }
    validate(data, meta) {
        if (this.map(data) === undefined) {
            return {};
        }
        return {
            [this.name]: this.validator.validate(this.map(data), meta),
        };
    }
}
exports.FieldValidator = FieldValidator;
function createFieldValidator(name, validator, map) {
    return new FieldValidator(name, validator, map);
}
exports.createFieldValidator = createFieldValidator;

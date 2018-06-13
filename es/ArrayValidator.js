"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArrayValidator {
    constructor(name, validators) {
        // this.name = name;
        this.validators = validators;
        this.validate = this.validate.bind(this);
    }
    *validate(data, meta) {
        if (data === undefined) {
            return;
        }
        for (const validator of this.validators) {
            yield* validator(data, meta);
        }
    }
}
exports.ArrayValidator = ArrayValidator;
function createValidator(name, ...validator) {
    return new ArrayValidator(name, validator);
}
exports.createValidator = createValidator;
//# sourceMappingURL=ArrayValidator.js.map
export class FormValidator {
    constructor(validator) {
        this.validate = (data, state, props) => {
            return this.validator.validate(data, state, props);
        };
        this.validator = validator;
    }
}
export const createFormValidator = (validator) => new FormValidator(validator);

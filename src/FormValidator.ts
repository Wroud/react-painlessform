import { IValidator } from "./Validator";

export type FormErrors<T> = {
    [P in keyof T]: string[];
};

export class FormValidator<TSource> implements IValidator<TSource, FormErrors<TSource>> {
    private validator: IValidator<TSource, any>;

    constructor(validator: IValidator<TSource, any>) {
        this.validator = validator;
    }

    validate = (data: TSource, state?, props?) => {
        return this.validator.validate(data, state, props) as FormErrors<TSource>;
    }
}

export const createFormValidator =
    <TSource>(validator: IValidator<TSource, any>): IValidator<TSource, FormErrors<TSource>> =>
        new FormValidator(validator);

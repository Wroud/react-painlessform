import { IValidator } from "./ArrayValidator";
import { FormErrors, IErrorMessage } from "./FormValidator";

export class FieldValidator<TSource, TValue, TMeta = {}> implements IValidator<TSource, FormErrors<TSource>, TMeta> {
    private name: keyof TSource;
    private validator: IValidator<TValue | TSource[keyof TSource], Array<IErrorMessage<any>>, TMeta>;
    private selectValue: (source: TSource) => TValue | TSource[keyof TSource];

    constructor(
        name: keyof TSource,
        validator: IValidator<TValue | TSource[keyof TSource], Array<IErrorMessage<any>>, TMeta>,
        selectValue?: (source: TSource) => TValue | TSource[keyof TSource],
    ) {
        this.name = name;
        this.selectValue = selectValue || (data => data[name]);
        this.validator = validator;
        this.validate = this.validate.bind(this);
    }

    validate(data: TSource, meta: TMeta): FormErrors<TSource> {
        if (data === undefined || this.selectValue(data) === undefined) {
            // tslint:disable-next-line:no-object-literal-type-assertion
            return {} as FormErrors<TSource>;
        }
        // tslint:disable-next-line:no-object-literal-type-assertion
        return {
            [this.name]: this.validator.validate(this.selectValue(data), meta),
        } as FormErrors<TSource>;
    }
}

export function createFieldValidator<TSource, TValue, TMeta = {}>(
    name: keyof TSource,
    validator: IValidator<TValue | TSource[keyof TSource], Array<IErrorMessage<any>>, TMeta>,
    seelctValue?: (source: TSource) => TValue | TSource[keyof TSource],
): IValidator<TSource, FormErrors<TSource>, TMeta> {
    return new FieldValidator(name, validator, seelctValue);
}

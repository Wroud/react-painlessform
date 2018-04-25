import { ClassProps, Consumer as FieldContext, Field, FieldModelContext, IField } from "../components/Field";
import { Consumer as FormContext, Form, IForm, IFormState } from "../components/Form";
import { Consumer as TransformContext, ITransform, ITransformContext, Transform } from "../components/Transform";
import { Consumer as ValidationContext, IValidation, IValidationContext, Validation } from "../components/Validation";

export interface IConsumerProps<T> {
    children?: (context: T) => React.ReactNode;
}

export type Consumer<T> = React.ComponentClass<IConsumerProps<T>>;

export interface IFormFactory<T> {
    Form: IForm<T>;
    Field: IField<T>;
    Transform: ITransform<T>;
    Validation: IValidation<T>;
    FormContext: Consumer<IFormState<T>>;
    FieldContext: Consumer<FieldModelContext<T>>;
    TransformContext: Consumer<ITransformContext<T>>;
    ValidationContext: Consumer<IValidationContext<T>>;
}

export function createFormFactory<T>(): IFormFactory<T> {
    return {
        Form: Form as any,
        Field: Field as any,
        Transform: Transform as any,
        Validation: Validation as any,
        FormContext: FormContext as any,
        FieldContext: FieldContext as any,
        TransformContext: TransformContext as any,
        ValidationContext: ValidationContext as any,
    };
}

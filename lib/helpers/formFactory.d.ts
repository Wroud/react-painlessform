/// <reference types="react" />
import { FieldModelContext, IField } from "../components/Field";
import { IForm, IFormState } from "../components/Form";
import { ITransform, ITransformContext } from "../components/Transform";
import { IValidation, IValidationContext } from "../components/Validation";
export interface IConsumerProps<T> {
    children?: (context: T) => React.ReactNode;
}
export declare type Consumer<T> = React.ComponentClass<IConsumerProps<T>>;
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
/**
 * Used for typings [[Form]], [[Field]], [[Transform]], [[Validation]]
 * and their contexts with `model` type
 */
export declare function createFormFactory<T>(): IFormFactory<T>;

/// <reference types="react" />
import { IField, IFieldContext } from "../components/Field";
import { IForm, IFormContext } from "../components/Form";
import { IScope } from "../components/Scope";
import { ITransform, ITransformContext } from "../components/Transform";
import { IValidation, IValidationContext } from "../components/Validation";
import { Path } from "../Path";
export interface IConsumerProps<T> {
    children?: (context: T) => React.ReactNode;
}
export declare type Consumer<T> = React.ComponentClass<IConsumerProps<T>>;
export interface IFormFactory<TModel extends object, TScope extends object = any> {
    Form: IForm<TModel>;
    Field: IField<TModel>;
    Transform: ITransform<TModel>;
    Validation: IValidation<TModel>;
    Scope: IScope<TScope, TModel>;
    FormContext: Consumer<IFormContext<TModel>>;
    FieldContext: Consumer<IFieldContext<any, TModel, any>>;
    TransformContext: Consumer<ITransformContext<TModel>>;
    ValidationContext: Consumer<IValidationContext<TModel>>;
    ScopeContext: Consumer<Path<TModel, any>>;
}
/**
 * Used for typings [[Form]], [[Field]], [[Transform]], [[Validation]]
 * and their contexts with `model` type
 */
export declare function createFormFactory<TModel extends object, TScope extends object = any>(): IFormFactory<TModel, TScope>;

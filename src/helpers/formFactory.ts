import { Consumer as FieldContext, Field, IField, IFieldContext } from "../components/Field";
import { Consumer as FormContext, Form, IForm, IFormContext } from "../components/Form";
import { Consumer as ScopeContext, IScope, Scope } from "../components/Scope";
import { Consumer as SubscribeContext, ISubscribe, ISubscribeContext, Subscribe } from "../components/Subscribe";
import { Consumer as TransformContext, ITransform, ITransformContext, Transform } from "../components/Transform";
import { Consumer as ValidationContext, IValidation, IValidationContext, Validation } from "../components/Validation";
import { Path } from "../Path";

export interface IConsumerProps<T> {
    children?: (context: T) => React.ReactNode;
}

export type Consumer<T> = React.ComponentClass<IConsumerProps<T>>;

export interface IFormFactory<TModel extends object, TScope extends object = any> {
    Form: IForm<TModel>;
    Field: IField<TModel>;
    Transform: ITransform<TModel>;
    Validation: IValidation<TModel>;
    Scope: IScope<TScope, TModel>;
    Subscribe: ISubscribe<TModel>;
    FormContext: Consumer<IFormContext<TModel>>;
    FieldContext: Consumer<IFieldContext<any, TModel, any>>;
    TransformContext: Consumer<ITransformContext<TModel>>;
    ValidationContext: Consumer<IValidationContext<TModel>>;
    ScopeContext: Consumer<Path<TModel, any>>;
    SubscribeContext: Consumer<ISubscribeContext<TModel, any>>;
}

/**
 * Used for typings [[Form]], [[Field]], [[Transform]], [[Validation]]
 * and their contexts with `model` type
 */
export function createFormFactory<TModel extends object, TScope extends object = any>(): IFormFactory<TModel, TScope> {
    return {
        Form: Form as any,
        Field: Field as any,
        Transform: Transform as any,
        Validation: Validation as any,
        Scope: Scope as any,
        Subscribe: Subscribe as any,
        FormContext: FormContext as any,
        FieldContext: FieldContext as any,
        TransformContext: TransformContext as any,
        ValidationContext: ValidationContext as any,
        ScopeContext: ScopeContext as any,
        SubscribeContext: SubscribeContext as any
    };
}

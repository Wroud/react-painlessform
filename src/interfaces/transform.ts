import { FieldSelector, ModelFieldSelector } from "./field";

export type IsField<TModel> = <TValue>(field: ModelFieldSelector<TModel, TValue>, strict?: boolean) => boolean;

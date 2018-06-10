import { ModelFieldSelector } from "./field";
export declare type IsField<TModel> = <TValue>(field: ModelFieldSelector<TModel, TValue>, strict?: boolean) => boolean;

export type IsField<TModel> = <TValue>(field: (values: TModel) => TValue, strict?: boolean) => boolean;

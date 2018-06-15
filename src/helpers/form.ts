import deepEqual = require("deep-equal");
import { IFieldState, IUpdateEvent, UpdateValue } from "../interfaces/field";
import { FieldsState } from "../interfaces/form";
import { Path } from "../Path";
import { deepExtend } from "../tools";

/**
 * Update `model` with [[Field]] `state`
 * @param value [[Field]]s state
 * @param state [[Form]] `model`
 */
export function updateFieldsState<T>(
    value: Partial<IFieldState>,
    state: FieldsState<T>,
    fields: Array<Path<FieldsState<T>, IFieldState>>
) {
    const newModel: FieldsState<T> = { ...(state as any) };
    fields.forEach(selector => {
        const prevState = selector.getValue(newModel, {} as IFieldState);
        selector.setValueImmutable(newModel, { ...prevState, ...value });
    });
    return newModel;
}

/**
 * Sets `values` to `model`
 * @param values fields values
 * @param model [[Form]] `model`
 */
export function mergeModels<T extends object>(value: T, model: T) {
    const newModel: T = { ...model as any };
    deepExtend(newModel, value);
    return { model: newModel, isChanged: deepEqual(model, newModel) };
}

export const isField = <TModel extends object>(
    state: TModel,
    from: IUpdateEvent<TModel, UpdateValue>,
    scope: Path<any, TModel>
) =>
    <TValue>(field: (values: TModel) => TValue, strict?: boolean) => {
        return from.selector.includes(scope.join(Path.fromSelector(field)), strict);
    };

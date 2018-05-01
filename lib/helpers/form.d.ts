import { IFieldState } from "../interfaces/field";
import { FormModel, IModelMap } from "../interfaces/form";
export declare function mergeModels<T>(value: Partial<FormModel<T>> | FormModel<T>, model: Partial<FormModel<T>> | FormModel<T>, rest?: (value: IFieldState<T>, prev: IFieldState<T>) => Partial<IFieldState<T>>): FormModel<T>;
/**
 * Update `model` with [[Field]] `state`
 * @param value [[Field]]s state
 * @param model [[Form]] `model`
 */
export declare function updateModelFields<T>(value: Partial<IFieldState<any>>, model: FormModel<T>): FormModel<T>;
/**
 * Sets `values` to `model`
 * @param values fields values
 * @param model [[Form]] `model`
 */
export declare function setModelValues<T>(values: T, model: FormModel<T>, rest?: Partial<IFieldState<T>>): FormModel<T>;
/**
 * Sets all fields `value` to empty string and `isChanged` & `isVisited` to `false`
 * @param model [[Form]] `model`
 */
export declare function resetModel<T>(model: FormModel<T>): FormModel<T>;
/**
 * Selects `values` from [[Form]] `model`
 * @param model [[Form]] `model`
 */
export declare function getValuesFromModel<T>(model: FormModel<T>): T;
export declare function getMapsFromModel<T>(model: FormModel<T>): IModelMap<T>;

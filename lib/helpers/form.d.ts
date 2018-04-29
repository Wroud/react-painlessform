import { IFieldState } from "../interfaces/field";
import { FormModel } from "../interfaces/form";
/**
 * Update `model` with [[Field]] `state`
 * @param value [[Field]]s state
 * @param model [[Form]] `model`
 */
export declare function updateModelFields<T>(value: Partial<IFieldState<any>>, model: FormModel<T>): FormModel<T>;
/**
 * Update `model` with `values`
 * @param values fields values
 * @param model [[Form]] `model`
 */
export declare function updateModel<T>(values: T, model: FormModel<T>): FormModel<T>;
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

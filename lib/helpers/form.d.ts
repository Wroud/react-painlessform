import { IFieldState } from "../interfaces/field";
import { FormModel } from "../interfaces/form";
export declare function updateModelFields<T>(value: Partial<IFieldState<any>>, model: FormModel<T>): FormModel<T>;
export declare function updateModel<T>(values: T, model: FormModel<T>): FormModel<T>;
export declare function resetModel<T>(model: FormModel<T>): FormModel<T>;
export declare function getValuesFromModel<T>(model: FormModel<T>): T;

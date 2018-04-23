import { IField } from "../components/Field";
import { IForm } from "../components/Form";
import { IFieldState } from "../interfaces/field";
import { FormModel } from "../interfaces/form";
export declare function updateModelFields<T>(value: Partial<IFieldState<any>>, model: FormModel<T>): FormModel<T>;
export declare function updateModel<T>(values: T, model: FormModel<T>): FormModel<T>;
export declare function resetModel<T>(model: FormModel<T>): FormModel<T>;
export declare function getValuesFromModel<T>(model: FormModel<T>): T;
export declare type Model<T> = {
    [P in keyof T]: IField<P, T[P], T>;
};
export interface IFormFactory<T> {
    Form: IForm<T>;
    Fields: Model<T>;
}
export declare function createFormFactory<T>(defaultValues: T): IFormFactory<T>;

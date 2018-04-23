import { IField } from "../components/Field";
import { IForm } from "../components/Form";
export declare type Model<T> = {
    [P in keyof T]: IField<P, T[P], T>;
};
export interface IFormFactory<T> {
    Form: IForm<T>;
    Fields: Model<T>;
}
export declare function createFormFactory<T>(defaultValues: T): IFormFactory<T>;

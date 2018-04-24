import { IField } from "../components/Field";
import { IForm } from "../components/Form";
export interface IFormFactory<T> {
    Form: IForm<T>;
    Field: IField<T>;
}
export declare function createFormFactory<T>(defaultValues: T): IFormFactory<T>;

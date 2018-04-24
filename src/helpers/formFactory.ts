import { Field, IField } from "../components/Field";
import { Form, IForm } from "../components/Form";

export interface IFormFactory<T> {
    Form: IForm<T>;
    Field: IField<T>;
}

export function createFormFactory<T>(): IFormFactory<T> {
    return {
        Form: Form as any,
        Field: Field as any,
    };
}

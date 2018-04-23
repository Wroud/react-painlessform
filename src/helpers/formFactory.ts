import { Field, IField } from "../components/Field";
import { Form, IForm } from "../components/Form";

export type Model<T> = {
    [P in keyof T]: IField<P, T[P], T>;
};

export interface IFormFactory<T> {
    Form: IForm<T>;
    Fields: Model<T>;
}

export function createFormFactory<T>(defaultValues: T): IFormFactory<T> {
    const Fields: Model<T> = {} as any;
    Object.keys(defaultValues).forEach(key => {
        Fields[key] = Field;
    });
    return {
        Form: Form as any,
        Fields,
    };
}

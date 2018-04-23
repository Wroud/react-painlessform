import { Field, IField } from "../components/Field";
import { Form, IForm } from "../components/Form";
import { IFieldState } from "../interfaces/field";
import { FormModel } from "../interfaces/form";

export function updateModelFields<T>(value: Partial<IFieldState<any>>, model: FormModel<T>) {
    const newModel: FormModel<T> = { ...(model as any) };
    for (const key of Object.keys(model)) {
        newModel[key] = {
            ...newModel[key],
            ...value,
        };
    }
    return newModel;
}

export function updateModel<T>(values: T, model: FormModel<T>) {
    const newModel: FormModel<T> = { ...(model as any) };
    for (const key of Object.keys(values)) {
        newModel[key] = { ...(newModel[key] || {}), value: values[key] };
    }
    return newModel;
}

export function resetModel<T>(model: FormModel<T>) {
    let newModel: FormModel<T> = {} as any;
    for (const key of Object.keys(model)) {
        newModel = {
            ...newModel as any,
            [key]: {
                value: "",
                isChanged: false,
                isVisited: false,
            },
        };
    }
    return newModel;
}

export function getValuesFromModel<T>(model: FormModel<T>): T {
    const values: T = {} as any;
    for (const key of Object.keys(model)) {
        values[key] = model[key].value;
    }
    return values;
}

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

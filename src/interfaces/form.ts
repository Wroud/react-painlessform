import { FieldClass } from "../components/Field";
import { IFieldState } from "./field";

export interface IFormConfiguration {
    submitting: {
        preventDefault: boolean;
    };
}

export interface IFormFields<T> {
    [key: string]: FieldClass<T>;
}

export type FormModel<T> = {
    [P in keyof T]: IFieldState<T[P]>;
};

export type BooleanMap<T> = {
    [P in keyof T]: boolean;
};

export interface IModelMap<T> {
    values: T;
    isVisited: BooleanMap<T>;
    isChanged: BooleanMap<T>;
}

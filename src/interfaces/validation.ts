import { IValidationProps } from "../components/Validation";

export type GetType<T> = T extends (...args: any[]) => infer P ? P : T;

export interface IValidationPropGetters {
    [key: string]: (...args: any[]) => any | object;
}

export type ValidationProps<T extends IValidationPropGetters> = { [P in keyof T]: GetType<T[P]> };

export interface IValidationMeta<T> {
    state: any;
    props: ValidationProps<IValidationProps<T>>;
}

// tslint:disable-next-line:no-empty-interface
export interface IValidationConfiguration { }

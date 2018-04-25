import { IValidationProps } from "../components/Validation";

export interface IValidationMeta<T> {
    state: any;
    props: IValidationProps<T>;
}

// tslint:disable-next-line:no-empty-interface
export interface IValidationConfiguration { }

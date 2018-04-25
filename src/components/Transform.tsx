import * as React from "react";

import { getValuesFromModel } from "../helpers/form";
import { createFormFactory } from "../helpers/formFactory";
import { IFieldState } from "../interfaces/field";
import { FormModel } from "../interfaces/form";

export interface ITranformProps<T> {
    transformer: (field: keyof T, value: IFieldState<T[typeof field]>, model: T) => Partial<T>;
    [key: string]: any;
}

export type ITransformContext<T> = (field: keyof T, value: IFieldState<T[typeof field]>) => any;

export const { Provider, Consumer } = React.createContext<ITransformContext<any>>(undefined);

export interface ITransform<T> extends Transform<T> {
    new(props: ITranformProps<T>): Transform<T>;
}

export class Transform<T> extends React.Component<ITranformProps<T>> {
    render() {
        const { FormContext } = createFormFactory<T>();
        return (
            <FormContext>
                {({ handleTransform, model }) => {
                    const handleChange = (field: keyof T, value: IFieldState<T[typeof field]>) => {
                        const transformation = this.props.transformer(field, value, getValuesFromModel(model));
                        let transform: Partial<FormModel<T>> = {
                            [field]: value,
                        } as any;
                        Object.keys(transformation).forEach(key => {
                            transform = {
                                ...transform as any,
                                [key]: {
                                    value: transformation[key],
                                    isVisited: true,
                                    isChanged: true,
                                },
                            };
                        });
                        handleTransform(transform);
                    };
                    return (
                        <Provider value={handleChange}>
                            {this.props.children}
                        </Provider>
                    );
                }}
            </FormContext>
        );
    }
}

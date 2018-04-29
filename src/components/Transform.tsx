import * as React from "react";

import { getValuesFromModel } from "../helpers/form";
import { createFormFactory } from "../helpers/formFactory";
import { IFieldState } from "../interfaces/field";
import { FormModel } from "../interfaces/form";
import { IForm, IFormState } from "./Form";

/**
 * Describes [[Transform]] props
 */
export interface ITranformProps<T> {
    /**
     * Transformer function that accepts changed `field` and his `value` and form `model`
     * and returns fields map to update values
     */
    transformer: (values: Partial<FormModel<T>>, model: FormModel<T>) => Partial<FormModel<T>>;
    [key: string]: any;
}

export interface ITransformContext<T> {
    mountTransform: (transformer: Transform<T>) => any;
    unMountTransform: (transformer: Transform<T>) => any;
    // transform: (field: keyof T, value: IFieldState<T[typeof field]>) => any;
}

export const { Provider, Consumer } = React.createContext<ITransformContext<any>>(undefined);

export interface ITransform<T> extends Transform<T> {
    new(props: ITranformProps<T>): Transform<T>;
}

/**
 * Transform is React Component that accpts [[ITranformProps]] as props
 * and passes [[transformer]] function as [[TransformContext]]
 */
export class Transform<T> extends React.Component<ITranformProps<T>> {
    private transformers: Array<Transform<T>> = [];
    private _context: IFormState<T> | ITransformContext<T>;
    transform = (values: Partial<FormModel<T>>, prevModel: FormModel<T>) => {
        let model: Partial<FormModel<T>> = { ...values as any };
        model = {
            ...model as any,
            ...this.props.transformer(model, prevModel) as any,
        };
        this.transformers.forEach(transformer => {
            model = {
                ...model as any,
                ...transformer.transform(model, prevModel) as any,
            };
        });
        return model;
    }
    render() {
        const { FormContext } = createFormFactory<T>();
        return (
            <Consumer>
                {trenasform => (
                    <FormContext>
                        {form => {
                            const context = {
                                mountTransform: this.mountTransform,
                                unMountTransform: this.unMountTransform,
                            };

                            this._context = trenasform || form;

                            return (
                                <Provider value={context}>
                                    {this.props.children}
                                </Provider>
                            );
                        }}
                    </FormContext>
                )}
            </Consumer>
        );
    }
    componentDidMount() {
        if (this._context) {
            this._context.mountTransform(this);
        }
    }
    componentWillUnmount() {
        if (this._context) {
            this._context.unMountTransform(this);
        }
    }
    private mountTransform = (value: Transform<T>) => {
        this.transformers.push(value);
    }
    private unMountTransform = (value: Transform<T>) => {
        const id = this.transformers.indexOf(value);
        if (id > -1) {
            this.transformers.slice(id, 1);
        }
    }
}

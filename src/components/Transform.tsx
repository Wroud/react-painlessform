import * as React from "react";

import { createFormFactory } from "../helpers/formFactory";
import { FormModel } from "../interfaces/form";

/**
 * Describes [[Transform]] props
 */
export interface ITranformProps<T> {
    /**
     * Transformer function that accepts changed `field` and his `value` and form `model`
     * and returns fields map to update values
     */
    transformer?: (values: Partial<FormModel<T>>, model: FormModel<T>) => Partial<FormModel<T>>;
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
    private _context: ITransformContext<T>;
    transform = (values: Partial<FormModel<T>>, prevModel: FormModel<T>) => {
        const { transformer } = this.props;
        let model: Partial<FormModel<T>> = { ...values as any };
        const transformed = transformer ? transformer(model, prevModel) : {};
        model = {
            ...model as any,
            ...transformed as any,
        };
        this.transformers.forEach(({ transform }) => {
            model = {
                ...model as any,
                ...transform(model, prevModel) as any,
            };
        });
        return model;
    }
    render() {
        const { FormContext } = createFormFactory<T>();
        return (
            <Consumer>
                {transform => {
                    const context = {
                        mountTransform: this.mountTransform,
                        unMountTransform: this.unMountTransform,
                    };

                    this._context = transform;

                    return (
                        <Provider value={context}>
                            {this.props.children}
                        </Provider>
                    );
                }}
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

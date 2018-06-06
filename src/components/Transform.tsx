import * as React from "react";

import { isField } from "../helpers/form";
import { FieldSelector, IUpdateEvent } from "../interfaces/field";
import { IFormStorage } from "../interfaces/form";

/**
 * Describes [[Transform]] props
 */
export interface ITranformProps<T extends object> {
    /**
     * Transformer function that accepts changed `field` and his `value` and form `model`
     * and returns fields map to update values
     */
    transformer?: (value: IUpdateEvent, is: (field: FieldSelector<T>) => boolean, state: IFormStorage<T>) => IterableIterator<IUpdateEvent>;
    [key: string]: any;
}

export interface ITransformContext<T extends object> {
    mountTransform: (transformer: Transform<T>) => any;
    unMountTransform: (transformer: Transform<T>) => any;
    // transform: (field: keyof T, value: IFieldState<T[typeof field]>) => any;
}

export const { Provider, Consumer } = React.createContext<ITransformContext<any>>(undefined);

export interface ITransform<T extends object> extends Transform<T> {
    new(props: ITranformProps<T>): Transform<T>;
}

/**
 * Transform is React Component that accpts [[ITranformProps]] as props
 * and passes [[transformer]] function as [[TransformContext]]
 */
export class Transform<T extends object> extends React.Component<ITranformProps<T>> {
    private transformers: Array<Transform<T>> = [];
    private _context: ITransformContext<T>;
    transform = (events: IterableIterator<IUpdateEvent>, state: IFormStorage<T>) => {
        const { transformer } = this.props;

        let next = events;

        if (transformer) {
            next = this.generator(next, transformer, state);
        }

        this.transformers.forEach(({ transform }) => {
            next = transform(next, state);
        });
        return next;
    }
    render() {
        const context = {
            mountTransform: this.mountTransform,
            unMountTransform: this.unMountTransform
        };
        return (
            <Consumer>
                {transform => {
                    this._context = transform;

                    return <Provider value={context}>{this.props.children}</Provider>;
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
            this.transformers.splice(id, 1);
        }
    }
    private *generator(
        iterator: IterableIterator<IUpdateEvent>,
        transformer: (value: IUpdateEvent, is: (field: FieldSelector<T>) => boolean, state: IFormStorage<T>) => IterableIterator<IUpdateEvent>,
        state: IFormStorage<T>
    ) {
        let result: IteratorResult<IUpdateEvent>;
        do {
            result = iterator.next();
            if (!result.value) {
                break;
            }
            yield* transformer(
                result.value,
                isField(state.values, result.value),
                state
            );
        } while (!result.done);
    }
}

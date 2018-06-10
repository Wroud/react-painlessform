import * as React from "react";

import { createFormFactory } from "..";
import { isField } from "../helpers/form";
import { IUpdateEvent } from "../interfaces/field";
import { FieldsState, IFormStorage } from "../interfaces/form";
import { IsField } from "../interfaces/transform";
import { IValidationState } from "../interfaces/validation";
import { exchangeIterator } from "../tools";
import { IScopeContext } from "./Scope";

/**
 * Describes [[Transform]] props
 */
export interface ITranformProps<TModel extends object> {
    /**
     * Transformer function that accepts changed `field` and his `value` and form `model`
     * and returns fields map to update values
     */
    transformer?: (value: IUpdateEvent<TModel>, is: IsField<TModel>, state: IFormStorage<TModel>) => IterableIterator<IUpdateEvent<TModel>>;
    [key: string]: any;
}

export interface ITransformContext<T extends object> {
    mountTransform: (transformer: Transform<T>) => any;
    unMountTransform: (transformer: Transform<T>) => any;
    // transform: (field: keyof T, value: IFieldState<T[typeof field]>) => any;
}

export const { Provider, Consumer } = React.createContext<ITransformContext<any> | undefined>(undefined);

export interface ITransform<T extends object> extends Transform<T> {
    new(props: ITranformProps<T>): Transform<T>;
}

function* addScope(event: IUpdateEvent<any>, ignore: IUpdateEvent<any>, scope: IScopeContext) {
    if (event.global || event !== ignore) {
        event.selector = scope(event.selector);
    }
    yield event;
}

/**
 * Transform is React Component that accpts [[ITranformProps]] as props
 * and passes [[transformer]] function as [[TransformContext]]
 */
export class Transform<TModel extends object> extends React.Component<ITranformProps<TModel>> {
    private transformers: Array<Transform<TModel>> = [];
    private _context: ITransformContext<TModel> | undefined;
    transform = (events: IterableIterator<IUpdateEvent<TModel>>, state: IFormStorage<TModel>) => {
        const { transformer } = this.props;
        const { scope } = this;

        let next = events;

        if (transformer) {
            // const valuesScope = fromProxy(autoCreateProxy(state.values), scope((f: TModel) => f));
            // const stateScope = fromProxy(autoCreateProxy(state.state), scope((f: FieldsState<TModel>) => f));
            // const validationScope = fromProxy(autoCreateProxy(state.validation), scope((f: IValidationState<TModel>) => f));
            const valuesScope = scope((f: TModel) => f)(state.values);
            const stateScope = scope((f: FieldsState<TModel>) => f)(state.state);
            const validationScope = scope((f: IValidationState<TModel>) => f)(state.validation);

            next = exchangeIterator(
                next,
                event => exchangeIterator(
                    transformer(event, isField(state.values, event, scope), {
                        ...state,
                        values: valuesScope,
                        state: stateScope,
                        validation: validationScope
                    }),
                    e => addScope(e, event, scope)
                ));
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
        const { ScopeContext } = createFormFactory<TModel>();
        return (
            <ScopeContext>
                {scope => (
                    <Consumer>
                        {transform => {
                            this._context = transform;
                            this.scope = scope;
                            return <Provider value={context}>{this.props.children}</Provider>;
                        }}
                    </Consumer>
                )}
            </ScopeContext>
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
    private scope: IScopeContext = s => s;
    private mountTransform = (value: Transform<TModel>) => {
        this.transformers.push(value);
    }
    private unMountTransform = (value: Transform<TModel>) => {
        const id = this.transformers.indexOf(value);
        if (id > -1) {
            this.transformers.splice(id, 1);
        }
    }
}

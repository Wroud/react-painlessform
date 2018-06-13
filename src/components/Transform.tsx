import * as React from "react";

import { createFormFactory } from "..";
import { isField } from "../helpers/form";
import { IUpdateEvent, UpdateValue } from "../interfaces/field";
import { FieldsState, IFormStorage } from "../interfaces/form";
import { IsField } from "../interfaces/transform";
import { ValidationModel } from "../interfaces/validation";
import { Path } from "../Path";
import { exchangeIterator } from "../tools";

/**
 * Describes [[Transform]] props
 */
export interface ITranformProps<TModel extends object> {
    /**
     * Transformer function that accepts changed `field` and his `value` and form `model`
     * and returns fields map to update values
     */
    transformer?: (value: IUpdateEvent<TModel, UpdateValue>, is: IsField<TModel>, state: Partial<IFormStorage<TModel>>) => IterableIterator<IUpdateEvent<TModel, UpdateValue>>;
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

function* addScope<T, TModel>(event: IUpdateEvent<any, T>, ignore: IUpdateEvent<any, T>, scope: Path<any, TModel>) {
    if (event.global || event !== ignore) {
        event.selector = scope.join(event.selector);
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
    private scope = Path.root<any>() as Path<any, TModel | FieldsState<TModel> | ValidationModel<TModel>>;
    transform = (events: IterableIterator<IUpdateEvent<TModel, UpdateValue>>, state: IFormStorage<any>) => {
        const { transformer } = this.props;
        const { scope } = this;

        let next = events;

        if (transformer) {
            const valuesScope = scope.getValue<TModel>(state.values);
            const stateScope = scope.getValue<FieldsState<TModel>>(state.state);
            const validationScope = scope.getValue(state.validation.errors, {} as ValidationModel<TModel>);

            next = exchangeIterator(
                next,
                event => exchangeIterator(
                    transformer(event, isField(state.values, event, scope), {
                        ...state,
                        values: valuesScope,
                        state: stateScope,
                        validation: {
                            ...state.validation,
                            errors: validationScope
                        }
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

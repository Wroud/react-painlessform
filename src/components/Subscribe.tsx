import * as React from "react";

import { createFormFactory } from "../helpers/formFactory";

import { ISubscriptionsMap, SubscriptionsMap } from "../interfaces/store";

import { FieldPath } from "..";
import { Path } from "../Path";

export interface ISubscriber {
    smartUpdate(events: Array<FieldPath<any, any>>);
}

export interface ISubscribeProps<TModel, TSub extends ISubscriptionsMap<TModel>> {
    to?: TSub;
}

export interface ISubscribeContext<TModel extends object, TSub extends ISubscriptionsMap<TModel>> {
    subscriptions: SubscriptionsMap<TModel, TSub>;
    subscribe: (subsciber: ISubscriber) => any;
    unSubscribe: (subsciber: ISubscriber) => any;
}

export const { Provider, Consumer } = React.createContext<ISubscribeContext<any, any> | undefined>(undefined);

export interface ISubscribe<TModel extends object = {}> extends Subscribe<TModel, any> {
    new <TSub extends ISubscriptionsMap<TModel>>(props: ISubscribeProps<TModel, TSub>): Subscribe<TModel, TSub>;
}

export class Subscribe<TModel extends object, TSub extends ISubscriptionsMap<TModel>> extends React.Component<ISubscribeProps<TModel, TSub>> implements ISubscriber {
    static defaultProps: ISubscribeProps<any, any> = {
        to: {}
    };
    private subscribers: ISubscriber[] = [];
    private subscriptions: Array<Path<any, any>> = [];
    private subscribeContext: ISubscribeContext<TModel, TSub>;
    private _context: ISubscribeContext<any, any> | undefined;

    constructor(props: ISubscribeProps<TModel, TSub>) {
        super(props);
        this.subscribeContext = {
            subscriptions: {} as any,
            subscribe: this.subscribe,
            unSubscribe: this.unSubscribe
        };
    }

    smartUpdate(events: Array<FieldPath<any, any>>) {
        if (events.some(f => this.subscriptions.some(s => s.includes(f)))) {
            this.forceUpdate();
            return;
        }
        for (const _validator of this.subscribers) {
            _validator.smartUpdate(events);
        }
    }

    render() {
        const { FormContext, ScopeContext } = createFormFactory<TModel>();
        const { to } = this.props;
        return (
            <FormContext>
                {formContext => (
                    <Consumer>
                        {subscriberContext => (
                            <ScopeContext>
                                {scope => {
                                    this._context = subscriberContext;

                                    if (to !== undefined) {
                                        this.subscribeContext.subscriptions = {} as any;
                                        this.subscriptions = [];
                                        Object.keys(to).forEach(key => {
                                            const subscription = scope.join(Path.fromSelector(to[key]));
                                            this.subscriptions.push(subscription);
                                            this.subscribeContext.subscriptions[key] = subscription.getValue(formContext.storage.values) as any;
                                        });
                                    }

                                    return <Provider value={this.subscribeContext}>{this.props.children}</Provider>;
                                }}
                            </ScopeContext>
                        )}
                    </Consumer>
                )}
            </FormContext>
        );
    }
    componentDidMount() {
        if (this._context && this._context.subscribe) {
            this._context.subscribe(this);
        }
    }
    componentWillUnmount() {
        if (this._context && this._context.unSubscribe) {
            this._context.unSubscribe(this);
        }
    }
    private subscribe = (value: ISubscriber) => {
        this.subscribers.push(value);
    }
    private unSubscribe = (value: ISubscriber) => {
        const id = this.subscribers.indexOf(value);
        if (id > -1) {
            this.subscribers.splice(id, 1);
        }
    }
}

/// <reference types="react" />
import * as React from "react";
import { ISubscriptionsMap, SubscriptionsMap } from "../interfaces/store";
import { FieldPath } from "..";
export interface ISubscriber {
    smartUpdate(events: Array<FieldPath<any, any>>): any;
}
export interface ISubscribeProps<TModel extends object, TSub extends ISubscriptionsMap<TModel>> {
    to?: TSub;
    children?: ((context: SubscriptionsMap<TSub>) => React.ReactNode) | React.ReactNode;
}
export interface ISubscribeContext<TModel extends object, TSub extends ISubscriptionsMap<TModel>> {
    subscriptions: SubscriptionsMap<TSub>;
    subscribe: (subsciber: ISubscriber) => any;
    unSubscribe: (subsciber: ISubscriber) => any;
}
export declare const Provider: React.ComponentType<React.ProviderProps<ISubscribeContext<any, any> | undefined>>, Consumer: React.ComponentType<React.ConsumerProps<ISubscribeContext<any, any> | undefined>>;
export interface ISubscribe<TModel extends object = {}> extends Subscribe<TModel, any> {
    new <TSub extends ISubscriptionsMap<TModel>>(props: ISubscribeProps<TModel, TSub>): Subscribe<TModel, TSub>;
}
export declare class Subscribe<TModel extends object, TSub extends ISubscriptionsMap<TModel>> extends React.Component<ISubscribeProps<TModel, TSub>> implements ISubscriber {
    private subscribers;
    private subscriptions;
    private subscribeContext;
    private _context;
    constructor(props: ISubscribeProps<TModel, TSub>);
    smartUpdate(events: Array<FieldPath<any, any>>): void;
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private subscribe;
    private unSubscribe;
}

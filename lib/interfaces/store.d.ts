import { Path } from "../Path";
export interface ISubscriptionsMap<TModel> {
    [key: string]: (model: TModel) => any;
}
export declare type SubscriptionsMap<T extends ISubscriptionsMap<any>> = {
    [P in keyof T]: ReturnType<T[P]>;
};
export declare type Subscriptions<TModel> = Array<Path<TModel, any>>;

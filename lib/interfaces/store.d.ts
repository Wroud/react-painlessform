import { Path } from "../Path";
export interface ISubscriptionsMap<TModel> {
    [key: string]: <TValue>(model: TModel) => TValue;
}
export declare type SubscriptionsMap<TModel, T extends ISubscriptionsMap<TModel>> = {
    [P in keyof T]: T[P] extends ((model: TModel) => infer R) ? R : never;
};
export declare type Subscriptions<TModel> = Array<Path<TModel, any>>;

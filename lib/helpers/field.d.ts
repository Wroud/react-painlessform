import { InputType } from "../components/Field";
import { IUpdateEvent } from "../interfaces/field";
import { IFormStorage } from "../interfaces/form";
export declare function castValue<T>(to: T, value: T, type: string, forwardedValue?: InputType<T>, multiple?: boolean): T;
export declare function isDiffEqual<TModel extends object>(diff: IUpdateEvent<TModel>, model: IFormStorage<TModel>): boolean;
export declare function isValueEqual<T>(diff: T, value: T): boolean;

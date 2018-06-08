import { InputType } from "../components/Field";
import { IUpdateEvent } from "../interfaces/field";
import { IFormStorage } from "../interfaces/form";
export declare function castValue<T>(to: T, value: T, forwardedValue: InputType<T>, type: string, multiple?: boolean): T;
export declare function isDiffEqual<T extends object>(diff: IUpdateEvent, model: IFormStorage<T>): boolean;
export declare function isValueEqual<T>(diff: T, value: T): boolean;

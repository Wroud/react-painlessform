export declare type PathSelector<TModel, TValue> = (model: TModel) => TValue;
export interface IInstruction {
    key: string;
    isIndex: boolean;
    isEnd?: boolean;
}
export interface IPath<TModel, TValue> extends Path<TModel, TValue> {
    new (selector: PathSelector<TModel, TValue>, path: string, instructions: IInstruction[]): Path<TModel, TValue>;
}
export declare class Path<TModel, TValue> {
    static fromSelector<TModel, TValue>(selector: PathSelector<TModel, TValue>): Path<TModel, TValue>;
    static root<TModel>(): Path<TModel, TModel>;
    private selector;
    private path;
    private instructions;
    constructor(selector: PathSelector<TModel, TValue>, path: string, instructions: IInstruction[]);
    getPath(): string;
    includes(path: Path<TModel, any>, strict?: boolean): boolean;
    includes2(path: (model: TModel) => any, strict?: boolean): boolean;
    join<T>(path: Path<TValue, T>): Path<TModel, T>;
    getValue<T extends TDefault extends null | undefined ? TValue : TDefault, TDefault extends TValue | null | undefined = undefined>(object: TModel, defaultValue?: TDefault): T | TDefault;
    setValue(object: TModel, value?: TValue | null): boolean;
    setValueImmutable(object: TModel, value?: TValue | null): boolean;
}
export declare function getPathInstructions(selector: (obj) => any, data: any): {
    path: string;
    instructions: IInstruction[];
};
export declare function isPath<TModel, TValue>(object: any): object is Path<TModel, TValue>;

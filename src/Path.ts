import { isArray } from "util";

export type PathSelector<TModel, TValue> = (model: TModel) => TValue;
export interface IInstruction {
    key: string;
    isIndex: boolean;
    isEnd?: boolean;
}

export interface IPath<TModel, TValue> extends Path<TModel, TValue> {
    new(selector: PathSelector<TModel, TValue>, path: string, instructions: IInstruction[]): Path<TModel, TValue>;
}

export class Path<TModel, TValue> {
    static fromSelector<TModel, TValue>(selector: PathSelector<TModel, TValue>) {
        const { path, instructions } = getPathInstructions(selector, {});
        return new Path<TModel, TValue>(selector, path, instructions);
    }
    static fromPath<TModel = any, TValue = any>(path: string) {
        const parts = path.replace(/(\[(\d)\])/g, ".$2").split(".");
        const instructions: IInstruction[] = [];
        for (const unit of parts) {
            const isIndex = !isNaN(unit.toString() as any);
            instructions.push({ isIndex, key: unit.toString() });
        }
        if (instructions.length > 0) {
            instructions[instructions.length - 1].isEnd = true;
        }
        return new Path<TModel, TValue>(f => f as any, path, instructions);
    }
    static root<TModel>() {
        return new Path<TModel, TModel>(f => f, "", []);
    }
    private selector: PathSelector<TModel, TValue>;
    private path: string;
    private instructions: IInstruction[];
    constructor(selector: PathSelector<TModel, TValue>, path: string, instructions: IInstruction[]) {
        this.selector = selector;
        this.instructions = instructions;
        this.path = path;
    }
    getPath() {
        return this.path;
    }
    includes(path: Path<TModel, any>, strict: boolean = false) {
        if (this.path.length === 0) {
            return false;
        }
        return strict
            ? this.path === path.path
            : this.path.startsWith(path.path);
    }
    includes2(path: (model: TModel) => any, strict: boolean = false) {
        if (this.path.length === 0) {
            return false;
        }
        const { path: str } = getPathInstructions(path, {});
        return strict
            ? this.path === str
            : this.path.startsWith(str);
    }
    join<T>(path: Path<TValue, T>) {
        const newPath = this.path.length > 0
            ? path.path.length > 0
                ? this.path + (path.path[0] === "[" ? "" : ".") + path.path
                : this.path
            : path.path;
        return new Path<TModel, T>(
            f => path.selector(this.selector(f)),
            newPath,
            [...this.instructions.map(i => ({ ...i, isEnd: false })), ...path.instructions]
        );
    }
    getValue<T extends TDefault extends null | undefined ? TValue : TDefault, TDefault extends TValue | null | undefined = undefined>(object: TModel, defaultValue?: TDefault): T | TDefault {
        let link = object;
        for (const instruction of this.instructions) {
            if (instruction.isEnd) {
                const result = link[instruction.key];
                return result === undefined ? defaultValue : result;
            }
            link = link[instruction.key];
            if (link === undefined) {
                return defaultValue as any;
            }
        }
        return object as any;
    }
    setValue(object: TModel, value?: TValue | null) {
        let link = object;
        for (const instruction of this.instructions) {
            if (instruction.isEnd) {
                link[instruction.key] = value;
                return true;
            }
            link = link[instruction.key];
            if (link === undefined) {
                return false;
            }
        }
        return false;
    }
    setValueImmutable(object: TModel, value?: TValue | null) {
        let link: TModel | undefined;
        let lastKey: string = "";
        for (const instruction of this.instructions) {
            if (!link) {
                link = object;
                lastKey = instruction.key;
                continue;
            }
            let current = link[lastKey];
            current = current === undefined
                ? instruction.isIndex ? [] : {}
                : !instruction.isIndex
                    ? { ...current }
                    : isArray(current)
                        ? [...current]
                        : [];
            link[lastKey] = current;
            link = current;
            lastKey = instruction.key;
        }
        if (link === undefined) {
            return false;
        }
        if (value === null) {
            delete link[lastKey];
        } else {
            link[lastKey] = value;
        }
        return true;
    }
}

export function getPathInstructions(selector: (obj) => any, data) {
    let path = "";
    const instructions: IInstruction[] = [];
    const proxyFactory = object => new Proxy(object, {
        get(target, prop) {
            if (prop === undefined) {
                return {};
            }
            const isIndex = !isNaN(prop.toString() as any);
            instructions.push({ isIndex, key: prop.toString() });
            path += isIndex
                ? `[${prop}]`
                : path === ""
                    ? `${prop}`
                    : `.${prop}`;

            let selectedVal = target[prop];
            if (selectedVal === undefined) {
                selectedVal = {};
            }
            if (typeof selectedVal === "object" && selectedVal !== null) {
                return proxyFactory(selectedVal);
            } else {
                return selectedVal;
            }
        }
    });
    selector(proxyFactory(data));
    if (instructions.length > 0) {
        instructions[instructions.length - 1].isEnd = true;
    }
    return { path, instructions };
}

export function isPath<TModel, TValue>(object): object is Path<TModel, TValue> {
    return "fromSelector" in object;
}

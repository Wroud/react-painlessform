"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class Path {
    constructor(selector, path, instructions) {
        this.selector = selector;
        this.instructions = instructions;
        this.path = path;
    }
    static fromSelector(selector) {
        const { path, instructions } = getPathInstructions(selector, {});
        return new Path(selector, path, instructions);
    }
    static fromPath(path) {
        const parts = path.replace(/(\[(\d)\])/g, ".$2").split(".");
        const instructions = [];
        for (const unit of parts) {
            const isIndex = !isNaN(unit.toString());
            instructions.push({ isIndex, key: unit.toString() });
        }
        if (instructions.length > 0) {
            instructions[instructions.length - 1].isEnd = true;
        }
        return new Path(f => f, path, instructions);
    }
    static root() {
        return new Path(f => f, "", []);
    }
    getPath() {
        return this.path;
    }
    includes(path, strict = false) {
        if (this.path.length === 0) {
            return false;
        }
        return strict
            ? this.path === path.path
            : this.path.startsWith(path.path);
    }
    includes2(path, strict = false) {
        if (this.path.length === 0) {
            return false;
        }
        const { path: str } = getPathInstructions(path, {});
        return strict
            ? this.path === str
            : this.path.startsWith(str);
    }
    join(path) {
        const newPath = this.path.length > 0
            ? path.path.length > 0
                ? this.path + (path.path[0] === "[" ? "" : ".") + path.path
                : this.path
            : path.path;
        return new Path(f => path.selector(this.selector(f)), newPath, [...this.instructions.map(i => (Object.assign({}, i, { isEnd: false }))), ...path.instructions]);
    }
    getValue(object, defaultValue) {
        let link = object;
        for (const instruction of this.instructions) {
            if (instruction.isEnd) {
                const result = link[instruction.key];
                return result === undefined ? defaultValue : result;
            }
            link = link[instruction.key];
            if (link === undefined) {
                return defaultValue;
            }
        }
        return object;
    }
    setValue(object, value) {
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
    setValueImmutable(object, value) {
        let link;
        let lastKey = "";
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
                    ? Object.assign({}, current) : util_1.isArray(current)
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
        }
        else {
            link[lastKey] = value;
        }
        return true;
    }
}
exports.Path = Path;
function getPathInstructions(selector, data) {
    let path = "";
    const instructions = [];
    const proxyFactory = object => new Proxy(object, {
        get(target, prop) {
            if (prop === undefined) {
                return {};
            }
            const isIndex = !isNaN(prop.toString());
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
            }
            else {
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
exports.getPathInstructions = getPathInstructions;
function isPath(object) {
    return "fromSelector" in object;
}
exports.isPath = isPath;
//# sourceMappingURL=Path.js.map
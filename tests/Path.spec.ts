import { expect } from "chai";
import "mocha";

import { Path } from "../src/Path";

describe("Path", () => {
    interface ITest {
        a: {
            b: {
                c: number;
            };
        };
    }

    const path0 = Path.fromSelector((f: ITest) => f.a);
    const path1 = Path.fromSelector((f: ITest) => f.a.b);
    const path2 = path0.join(Path.fromSelector((a: ITest["a"]) => a.b));

    it("includes closest", () => {
        expect(path0.includes(path1)).to.be.equal(false);
    });
    it("includes further", () => {
        expect(path1.includes(path0)).to.be.equal(true);
    });
    it("includes strict negative", () => {
        expect(path1.includes(path0, true)).to.be.equal(false);
    });
    it("includes strict positive", () => {
        expect(path2.includes(path1, true)).to.be.equal(true);
    });
    it("getValue returns undefined if object doesn't implements path", () => {
        expect(path0.getValue({} as any)).to.be.equal(undefined);
    });
    it("getValue returns value", () => {
        expect(path0.getValue({ a: 1 } as any)).to.be.equal(1);
    });
    it("getValue after join returns value", () => {
        expect(path2.getValue({ a: { b: 1 } } as any)).to.be.equal(1);
    });
    it("setValue positive", () => {
        const obj = {};
        const setObj = {};
        expect(path0.setValue(obj as any, setObj as any)).to.be.equal(true);
    });
    it("setValue negative", () => {
        const obj = {};
        const setObj = {};
        expect(path1.setValue(obj as any, setObj as any)).to.be.equal(false);
    });
    it("setValueImmutable positive", () => {
        const obj = {};
        const setObj = {};
        expect(path1.setValueImmutable(obj as any, setObj as any)).to.be.equal(true);
        expect(obj).to.be.deep.equal({ a: { b: setObj } });
    });

});

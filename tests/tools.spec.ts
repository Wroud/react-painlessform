import * as chai from "chai";
import "mocha";

import { isArrayEqual } from "../src/tools";

describe("Tools", () => {

    it("isArrayEqual", () => {
        const positiveArrays = [
            [undefined, undefined],
            [[], []],
            [["1"], ["1"]],
            [["1", "2"], ["1", "2"]]
        ];
        for (const arr of positiveArrays) {
            chai.expect(isArrayEqual(arr[0], arr[1])).to.be.equal(true);
        }
        const negativeArrays = [
            [undefined, []],
            [[], undefined],
            [["1"], ["2"]],
            [["1", "2"], ["1"]],
            [["1", "2"], ["2"]],
            [["1", "2"], ["2", "1"]],
            [["2", "1"], ["1", "2"]],
            [["1", "2"], ["1", "2", "3"]],
            [["1", "2", "3"], ["1", "2"]]
        ];
        for (const arr of negativeArrays) {
            chai.expect(isArrayEqual(arr[0], arr[1])).to.be.equal(false);
        }
    });

});

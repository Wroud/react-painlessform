import * as chai from "chai";
import * as assertArrays from "chai-arrays";
import "mocha";

import { getMapsFromModel, resetModel } from "../../src/helpers/form";

chai.use(assertArrays);

describe("Helpers", () => {

    it("resetModel", () => {
        const curmodel = {
            field: {
                value: 1,
                isChanged: true,
                isVisited: true,
                isFocus: true
            },
            field2: {
                value: 33,
                isChanged: true,
                isVisited: true,
                isFocus: true
            }
        };
        const expmodel = {
            field: {
                value: "",
                isChanged: false,
                isVisited: false,
                isFocus: false
            },
            field2: {
                value: "",
                isChanged: false,
                isVisited: false,
                isFocus: false
            }
        };
        chai.assert.deepEqual(resetModel(curmodel), expmodel as any);
    });

    it("getMapsFromModel", () => {
        chai.expect(getMapsFromModel(undefined)).to.equal(undefined);
    });

});

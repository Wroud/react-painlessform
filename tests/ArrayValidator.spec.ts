import * as chai from "chai";
import * as assertArrays from "chai-arrays";
import "mocha";
import { createValidator } from "../src";

chai.use(assertArrays);

describe("ArrayValidator", () => {

    it("test", () => {
        const stringNotNull = value => value === undefined || value.length === 0 ? "Requered" : [];
        const stringMaxLength = value =>
            value === undefined
                || !value.length
                || value.length < 3
                ? "Min 3"
                : [];

        const validator = createValidator<string>("not Null", stringNotNull, stringMaxLength);
        const noErrors = validator.validate("1234");

        chai.expect(noErrors).to.length(0);
        const withErrors = validator.validate("");

        chai.expect(withErrors).to.be.equalTo(["Requered", "Min 3"]);
    });

    it("test meta", () => {
        const stringNotNull = (value: string, meta: boolean) => meta ? "Requered" : [];

        const validator = createValidator<string, boolean>("not Null", stringNotNull);
        const noErrors = validator.validate("", false);

        chai.expect(noErrors).to.length(0);
        const withErrors = validator.validate("", true);

        chai.expect(withErrors).to.be.equalTo(["Requered"]);
    });

});

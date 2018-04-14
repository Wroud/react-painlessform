import * as chai from "chai";
import * as assertArrays from "chai-arrays";
import "mocha";
import { createFieldValidator, createFormValidator, createRawFormValidator, createValidator } from "../src";

chai.use(assertArrays);

describe("FormValidator", () => {

    it("test", () => {
        interface IModel {
            field0: string;
            field1: string;
        }

        const stringNotNull = value =>
            value === undefined
                || value.length === 0
                ? "Requered"
                : [];

        const stringMaxLength = value =>
            value === undefined
                || !value.length
                || value.length < 3
                ? "Min 3"
                : [];

        const validator = createValidator<string>("not Null", stringNotNull, stringMaxLength);
        const field0Validator = createFieldValidator<IModel, string>("field0", validator);
        const field1Validator = createFieldValidator<IModel, string>("field1", validator);
        const formValidator = createFormValidator<IModel>(field0Validator, field1Validator);

        const model0: IModel = {
            field0: "1234",
            field1: "1234",
        };
        const noErrors = formValidator.validate(model0);
        chai.expect(noErrors).to.not.have.property("field0");
        chai.expect(noErrors).to.not.have.property("field1");
        // chai.expect(noErrors.field0).to.length(0);
        // chai.expect(noErrors.field1).to.length(0);

        const model1: IModel = {
            field0: "",
            field1: "1",
        };
        const withErrors = formValidator.validate(model1);
        chai.expect(withErrors).to.have.property("field0");
        chai.expect(withErrors).to.have.property("field1");
        chai.expect(withErrors.field0).to.be.equalTo(["Requered", "Min 3"]);
        chai.expect(withErrors.field1).to.be.equalTo(["Min 3"]);
    });

    it("test meta", () => {
        interface IModel {
            field: string;
        }

        const stringNotNull = (value: string, meta: boolean) => meta ? "Requered" : [];

        const validator = createValidator<string, boolean>("not Null", stringNotNull);
        const fieldValidator = createFieldValidator<IModel, string>("field", validator);
        const formValidator = createFormValidator<IModel>(fieldValidator);

        const model: IModel = {
            field: "",
        };
        const noErrors = formValidator.validate(model, false);
        chai.expect(noErrors).to.not.have.property("field");

        const withErrors = formValidator.validate(model, true);
        chai.expect(withErrors).to.have.property("field");
        chai.expect(withErrors.field).to.be.equalTo(["Requered"]);
    });

});

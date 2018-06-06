import * as chai from "chai";
import * as assertArrays from "chai-arrays";
import "mocha";
import { createFieldValidator, createValidator } from "../src";

chai.use(assertArrays);

// describe("FieldValidator", () => {

//     it("test", () => {
//         const stringNotNull = value =>
//             value === undefined
//                 || value.length === 0
//                 ? ["Requered"]
//                 : [];

//         const stringMaxLength = value =>
//             value === undefined
//                 || !value.length
//                 || value.length < 3
//                 ? ["Min 3"]
//                 : [];

//         const validator = createValidator<string>("not Null", stringNotNull, stringMaxLength);
//         const fieldValidator = createFieldValidator<{ field: string }, string>(data => data.field, validator);

//         const noErrors = fieldValidator.validate({ field: "1234" });
//         chai.expect(noErrors).to.have.property("field");
//         chai.expect(noErrors.field).to.length(0);

//         const withErrors = fieldValidator.validate({ field: "" });
//         chai.expect(withErrors).to.have.property("field");
//         chai.expect(withErrors.field).to.be.equalTo(["Requered", "Min 3"]);
//     });

//     it("test meta", () => {
//         const stringNotNull = (value: string, meta: boolean) => meta ? "Requered" : [];

//         const validator = createValidator<string, boolean>("not Null", stringNotNull);
//         const fieldValidator = createFieldValidator<{ field: string }, string>("field", validator);

//         const noErrors = fieldValidator.validate({ field: "" }, false);
//         chai.expect(noErrors).to.have.property("field");
//         chai.expect(noErrors.field).to.length(0);

//         const withErrors = fieldValidator.validate({ field: "" }, true);
//         chai.expect(withErrors).to.have.property("field");
//         chai.expect(withErrors.field).to.be.equalTo(["Requered"]);
//     });

//     it("test empty model", () => {
//         const stringNotNull = (value: string, meta: boolean) => meta ? "Requered" : [];

//         const validator = createValidator<string, boolean>("not Null", stringNotNull);
//         const fieldValidator = createFieldValidator<{ field: string }, string>("field", validator);

//         const noErrors = fieldValidator.validate(undefined, false);
//         chai.expect(noErrors).to.not.have.property("field");
//     });

// });

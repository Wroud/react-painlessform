import chai, { assert, expect, use } from "chai";
import * as assertArrays from "chai-arrays";
import "mocha";
import * as React from "react";
import { createRenderer, ShallowRenderer } from "react-test-renderer/shallow";
import * as Yup from "yup";

import {
    createFieldValidator,
    createFormValidator,
    createRawFormValidator,
    createValidator,
    FormContext,
    IValidationProps,
    Validation
} from "../../src";
import { defaultConfiguration, IFormContext } from "../../src/components/Form";

use(assertArrays);
describe("Validation", () => {
    let renderer: ShallowRenderer;
    const fieldRequired = createValidator<string>("field", value => {
        // console.log(">>>", value);
        return !value || value.length === 0 ? ["Required"] : [];
    });
    const fieldValidator = createFieldValidator<any, string>(m => m.field, fieldRequired);
    const validator = createFormValidator(fieldValidator);
    const validatorScope = createRawFormValidator<any>(model => {
        // return validator.validate(model);
        return [{
            selector: m => m.field,
            scope: [{ message: "Required" }]
        }];
    });

    beforeEach(() => {
        renderer = createRenderer();
        renderer.render(<Validation validator={validator} scopeValidator={validatorScope}><br /></Validation>);
    });

    it("correct custom validator", () => {
        const result = renderer.getRenderOutput<React.ReactElement<IValidationProps<any>>>();
        const resultInstance = renderer.getMountedInstance() as Validation<any>;

        const resultSnapshot = {
            isValid: false,
            errors: {
                field: [
                    {
                        message: "Required"
                    }
                ]
            },
            scope: [{ message: "Required" }]
        };
        const model = {
            field: ""
        };
        const validationResult = resultInstance.validate(model);
        // console.log(validationResult);
        expect(validationResult.isValid).to.be.equal(resultSnapshot.isValid);
        expect(validationResult.scope.map(error => error.message)).to.be.equalTo(resultSnapshot.scope.map(error => error.message));
        expect(validationResult.errors.field.map(error => error.message)).to.be.equalTo(resultSnapshot.errors.field.map(error => error.message));
    });
});

describe("Validation Yup", () => {
    let renderer: ShallowRenderer;

    beforeEach(() => {
        renderer = createRenderer();
        const shape = Yup.object().shape({
            field: Yup.string()
                .min(2, "C'mon, your name is longer than that")
                .required("First name is required.")
        });
        renderer.render(<Validation validator={shape}><br /></Validation>);
    });

    it("correct", () => {
        const result = renderer.getRenderOutput<React.ReactElement<IValidationProps<any>>>();
        const resultInstance = renderer.getMountedInstance() as Validation<any>;

        const resultSnapshot = {
            isValid: false,
            errors: {
                field: [
                    {
                        message: "C'mon, your name is longer than that"
                    },
                    {
                        message: "First name is required."
                    }
                ]
            },
            scope: []
        };
        const values = {
            field: ""
        };
        const validationResult = resultInstance.validate(values);
        expect(validationResult.isValid).to.be.equal(resultSnapshot.isValid);
        expect(validationResult.scope.map(error => error.message)).to.be.equalTo(resultSnapshot.scope);
        expect(validationResult.errors.field.map(error => error.message)).to.be.equalTo(resultSnapshot.errors.field.map(error => error.message));
    });

    it("must return [] if model undefined", () => {
        const result = renderer.getRenderOutput<React.ReactElement<IValidationProps<any>>>();
        const resultInstance = renderer.getMountedInstance() as Validation<any>;

        const values = undefined;
        const validationResult = resultInstance.validate(values);
        expect(validationResult.isValid).to.be.equal(true);
        expect(validationResult.scope.map(error => error.message)).to.be.equalTo([]);
        expect(validationResult.errors).to.be.deep.equal({});
    });
});

describe("Validation Yup with config", () => {
    let renderer: ShallowRenderer;

    beforeEach(() => {
        renderer = createRenderer();
        const shape = Yup.object().shape({
            field: Yup.string()
                .min(2, "C'mon, your name is longer than that")
                .required("First name is required.")
        });
        renderer.render(<Validation validator={shape} configure={{ abortEarly: true }}><br /></Validation>);
    });

    it("correct", () => {
        const result = renderer.getRenderOutput<React.ReactElement<IValidationProps<any>>>();
        const resultInstance = renderer.getMountedInstance() as Validation<any>;

        const resultSnapshot = {
            isValid: false,
            errors: {
                field: [
                    {
                        message: "C'mon, your name is longer than that"
                    }
                ]
            },
            scope: []
        };
        const values = {
            field: ""
        };
        const validationResult = resultInstance.validate(values);
        expect(validationResult.isValid).to.be.equal(resultSnapshot.isValid);
        expect(validationResult.scope.map(error => error.message)).to.be.equalTo(resultSnapshot.scope);
        expect(validationResult.errors.field.map(error => error.message)).to.be.equalTo(resultSnapshot.errors.field.map(error => error.message));
    });
});

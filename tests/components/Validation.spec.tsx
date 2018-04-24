import chai, { assert, expect, use } from "chai";
import * as assertArrays from "chai-arrays";
import "mocha";
import * as React from "react";
import { createRenderer, ShallowRenderer } from "react-test-renderer/shallow";
import * as Yup from "yup";
import { FormContext, IFormState, IValidationProps, Validation } from "../../src";
import { defaultConfiguration } from "../../src/components/Form";

use(assertArrays);
describe("Validation", () => {
    let renderer: ShallowRenderer;

    beforeEach(() => {
        renderer = createRenderer();
        renderer.render(<Validation><br /></Validation>);
    });

    it("should render correctly", () => {
        const result = renderer.getRenderOutput();
        assert.strictEqual(result.type, FormContext);
    });
});

describe("Validation Yup", () => {
    let renderer: ShallowRenderer;

    beforeEach(() => {
        renderer = createRenderer();
        const shape = Yup.object().shape({
            field: Yup.string()
                .min(2, "C'mon, your name is longer than that")
                .required("First name is required."),
        });
        renderer.render(<Validation validator={shape}><br /></Validation>);
    });

    it("correct", () => {
        const result = renderer.getRenderOutput<React.ReactElement<IValidationProps>>();
        const resultInstance = renderer.getMountedInstance() as Validation;

        const resultSnapshot = {
            isValid: false,
            errors: {
                field: [
                    {
                        message: "C'mon, your name is longer than that",
                    },
                    {
                        message: "First name is required.",
                    },
                ],
            },
            scope: [],
        };
        const formState: IFormState<any> = {
            model: {
                field: {
                    value: "",
                    isChanged: false,
                    isVisited: false,
                },
            },
            isChanged: false,
            configure: defaultConfiguration,
            isSubmitting: false,
            handleChange: () => "handleChange",
            handleReset: () => "handleReset",
        };
        const validationResult = resultInstance.validate(formState);
        expect(validationResult.isValid).to.be.equal(resultSnapshot.isValid);
        expect(validationResult.scope.map(error => error.message)).to.be.equalTo(resultSnapshot.scope);
        expect(validationResult.errors.field.map(error => error.message)).to.be.equalTo(resultSnapshot.errors.field.map(error => error.message));
    });
});

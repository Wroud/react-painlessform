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
    const validator = {
        validate: model => {
            const error = !model.field || model.field.length === 0 ? "Required" : undefined;
            let errors = [];
            if (error) {
                errors = [{
                    message: error,
                }];
            }
            return {
                field: errors,
            };
        },
    };
    const validatorScope = {
        validate: model => {
            const error = !model.field || model.field.length === 0 ? "Required" : undefined;
            let errors = [];
            if (error) {
                errors = [{
                    message: error,
                }];
            }
            return [...errors];
        },
    };

    beforeEach(() => {
        renderer = createRenderer();
        renderer.render(<Validation validator={validator} scopeValidator={validatorScope}><br /></Validation>);
    });

    it("should render correctly", () => {
        const result = renderer.getRenderOutput();
        assert.strictEqual(result.type, FormContext);
    });

    it("correct custom validator", () => {
        const result = renderer.getRenderOutput<React.ReactElement<IValidationProps<any>>>();
        const resultInstance = renderer.getMountedInstance() as Validation<any>;

        const resultSnapshot = {
            isValid: false,
            errors: {
                field: [
                    {
                        message: "Required",
                    },
                ],
            },
            scope: [{ message: "Required" }],
        };
        const formState: Partial<IFormState<any>> = {
            model: {
                field: {
                    value: "",
                    isChanged: false,
                    isVisited: false,
                },
            },
        };
        const validationResult = resultInstance.validate(formState as any);
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
                .required("First name is required."),
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
            handleTransform: () => "handleTransform",
        };
        const validationResult = resultInstance.validate(formState);
        expect(validationResult.isValid).to.be.equal(resultSnapshot.isValid);
        expect(validationResult.scope.map(error => error.message)).to.be.equalTo(resultSnapshot.scope);
        expect(validationResult.errors.field.map(error => error.message)).to.be.equalTo(resultSnapshot.errors.field.map(error => error.message));
    });

    it("must return [] if model undefined", () => {
        const result = renderer.getRenderOutput<React.ReactElement<IValidationProps<any>>>();
        const resultInstance = renderer.getMountedInstance() as Validation<any>;

        const formState: IFormState<any> = {
            model: undefined,
            isChanged: false,
            configure: defaultConfiguration,
            isSubmitting: false,
            handleChange: () => "handleChange",
            handleReset: () => "handleReset",
            handleTransform: () => "handleTransform",
        };
        const validationResult = resultInstance.validate(formState);
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
                .required("First name is required."),
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
                        message: "C'mon, your name is longer than that",
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
            handleTransform: () => "handleTransform",
        };
        const validationResult = resultInstance.validate(formState);
        expect(validationResult.isValid).to.be.equal(resultSnapshot.isValid);
        expect(validationResult.scope.map(error => error.message)).to.be.equalTo(resultSnapshot.scope);
        expect(validationResult.errors.field.map(error => error.message)).to.be.equalTo(resultSnapshot.errors.field.map(error => error.message));
    });
});

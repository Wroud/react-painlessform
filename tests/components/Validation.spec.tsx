import chai, { assert, expect, use } from "chai";
import { mount, ReactWrapper, shallow } from "enzyme";
import "mocha";
import * as React from "react";

import * as Yup from "yup";

import {
    createFieldValidator,
    createFormFactory,
    createFormValidator,
    createRawFormValidator,
    createValidator,
    FormContext,
    IValidationProps
} from "../../src";
import { defaultConfiguration, IFormContext } from "../../src/components/Form";

describe("Validation", () => {
    let wrapper: ReactWrapper<any, any>;
    const fieldRequired = createValidator<string>("field", value => {
        return !value || value.length === 0 ? ["Required"] : [];
    });
    const fieldValidator = createFieldValidator<any, string>(m => m.field, fieldRequired);
    const validatorScope = createRawFormValidator<any>(model => {
        return [{
            selector: undefined,
            scope: [{ message: "Required" }]
        }][Symbol.iterator]();
    });
    const validator = createFormValidator(fieldValidator, validatorScope);

    const { Form, Validation, Field } = createFormFactory<{ field: string }>();
    beforeEach(() => {
        wrapper = mount(
            <Form>
                <Validation validator={validator}>
                    <Field name={f => f.field}>
                        {({ inputHook }) => <input {...inputHook} />}
                    </Field>
                </Validation>
            </Form>
        );
    });

    it("correct custom validator", () => {
        wrapper.find("input").simulate("change", { target: { value: "" } });
        const result = wrapper.find("FieldClass").props();

        const resultSnapshot = {
            isValid: false,
            errors: [{ message: "Required" }],
            scope: [{ message: "Required" }]
        };
        expect(result.isValid).to.be.equal(resultSnapshot.isValid);
        expect(result.validationScope.map(error => error.message)).to.be.equalTo(resultSnapshot.scope.map(error => error.message));
        expect(result.validationErrors.map(error => error.message)).to.be.equalTo(resultSnapshot.errors.map(error => error.message));
    });
});

describe("Validation Yup", () => {
    let wrapper: ReactWrapper<any, any>;

    const { Form, Validation, Field } = createFormFactory<{ field: string }>();
    beforeEach(() => {
        const shape = Yup.object<{ field: string }>().shape({
            field: Yup.string()
                .min(2, "C'mon, your name is longer than that")
                .required("First name is required.")
        });
        wrapper = mount(
            <Form>
                <Validation validator={shape}>
                    <Field name={f => f.field}>
                        {({ inputHook }) => <input {...inputHook} />}
                    </Field>
                </Validation>
            </Form>
        );
    });

    it("correct", () => {
        wrapper.find("input").simulate("change", { target: { value: "" } });
        const result = wrapper.find("FieldClass").props();

        const resultSnapshot = {
            isValid: false,
            errors: [
                { message: "C'mon, your name is longer than that" },
                { message: "First name is required." }
            ],
            scope: []
        };
        expect(result.isValid).to.be.equal(resultSnapshot.isValid);
        expect(result.validationScope.map(error => error.message)).to.be.equalTo(resultSnapshot.scope.map(error => error.message));
        expect(result.validationErrors.map(error => error.message)).to.be.equalTo(resultSnapshot.errors.map(error => error.message));
    });
});

describe("Validation Yup with config", () => {
    let wrapper: ReactWrapper<any, any>;

    const { Form, Validation, Field } = createFormFactory<{ field: string }>();
    beforeEach(() => {
        const shape = Yup.object<{ field: string }>().shape({
            field: Yup.string()
                .min(2, "C'mon, your name is longer than that")
                .required("First name is required.")
        });
        wrapper = mount(
            <Form>
                <Validation validator={shape} configure={{ abortEarly: true }}>
                    <Field name={f => f.field}>
                        {({ inputHook }) => <input {...inputHook} />}
                    </Field>
                </Validation>
            </Form>
        );
    });

    it("correct", () => {
        wrapper.find("input").simulate("change", { target: { value: "" } });
        const result = wrapper.find("FieldClass").props();

        const resultSnapshot = {
            isValid: false,
            errors: [
                { message: "C'mon, your name is longer than that" }
            ],
            scope: []
        };
        expect(result.isValid).to.be.equal(resultSnapshot.isValid);
        expect(result.validationScope.map(error => error.message)).to.be.equalTo(resultSnapshot.scope.map(error => error.message));
        expect(result.validationErrors.map(error => error.message)).to.be.equalTo(resultSnapshot.errors.map(error => error.message));
    });
});

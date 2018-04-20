import chai, { assert, expect, use } from "chai";
import * as assertArrays from "chai-arrays";
import "mocha";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createRenderer, ShallowRenderer } from "react-test-renderer/shallow";
import { FieldClass, FieldProvider, IFormState } from "../../src";

use(assertArrays);
describe("Field", () => {
    let renderer: ShallowRenderer;
    const onChange = () => "";
    const onClick = () => "";

    beforeEach(() => {
        renderer = createRenderer();
        const formState: IFormState<any> = {
            model: { field: 1 },
            isSubmitting: false,
            handleChange: () => "handleChange",
            handleReset: () => "handleReset",
        };
        renderer.render(<FieldClass
            name={"field"}
            value={formState.model.field}
            formState={formState}
            validationErrors={["one"]}
            onClick={onClick}
            onChange={onChange}
        >
            {({ value }) => <div>{value}</div>}
        </FieldClass>);
    });

    it("should render correctly", () => {
        const result = renderer.getRenderOutput();
        assert.strictEqual(result.type, FieldProvider);
    });

    it("should have correct prop values", () => {
        const result = renderer.getRenderOutput();
        const resultInstance = renderer.getMountedInstance();
        const {
            props: {
                value: {
                    value,
                    name,
                    validationErrors,
                    onChange: rOnChange,
                    onClick: rOnClick,
                },
            },
        } = result;

        assert.strictEqual(value, 1);
        assert.strictEqual(name, "field");
        // expect(rOnChange).to.be.equal(onChange);
        // expect(rOnClick).to.be.equal(onClick);
        expect(validationErrors).to.be.equalTo(["one"]);
    });
});

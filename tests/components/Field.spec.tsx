import chai, { assert, expect, use } from "chai";
import * as assertArrays from "chai-arrays";
import "mocha";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createRenderer, ShallowRenderer } from "react-test-renderer/shallow";
import { FieldClass, FieldProvider, IFieldProps, IFieldState, IFormState } from "../../src";

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
            validationErrors={[{ message: "one" }]}
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
        const result = renderer.getRenderOutput<React.ReactElement<{ value: IFieldProps<any> }>>();
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
        expect(validationErrors.map(error => error.message)).to.be.equalTo(["one"]);
    });
});

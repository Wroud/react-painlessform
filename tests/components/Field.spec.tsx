import chai, { assert, expect, use } from "chai";
import * as assertArrays from "chai-arrays";
import "mocha";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { createRenderer, ShallowRenderer } from "react-test-renderer/shallow";
import { FieldClass, IFieldProps, IFormState } from "../../src";
import { IFieldClass } from "../../src/components/Field";
import { IFormContext } from "../../src/components/Form";
import { setModelValues } from "../../src/helpers/form";

use(assertArrays);
describe("Field", () => {
    let renderer: ShallowRenderer;
    const onChange = () => "";
    const onClick = () => "";
    const model = {
        field: 1,
        field2: "123"
    };
    const Field = FieldClass as any as IFieldClass<typeof model>;

    beforeEach(() => {
        renderer = createRenderer();
        const formState: IFormContext<typeof model> = {
            model: setModelValues(model, {} as any),
            isChanged: false,
            isSubmitting: false,
            handleChange: () => "handleChange",
            handleReset: () => "handleReset"
        };
        renderer.render(
            <Field
                name={"field2"}
                value={model.field2}
                form={formState}
                validationErrors={[{ message: "one" }]}
                validationScope={[]}
                isChanged={false}
                isVisited={false}
                isValid={true}
                onClick={onClick}
                onChange={onChange}
                rest={({})}
            >
                {({ value }) => <div>{value}</div>}
            </Field>
        );
    });

    // it("should render correctly", () => {
    //     const result = renderer.getRenderOutput();
    //     assert.strictEqual(result.type, FieldProvider);
    // });

    it("should have correct prop values", () => {
        type elementInstance = IFieldClass<typeof model>;
        type element = React.ReactElement<IFieldProps<"field2", string, typeof model>>;
        const result = renderer.getRenderOutput<element>();
        const resultInstance = renderer.getMountedInstance() as elementInstance;
        const {
            props: {
                value,
                name,
                validationErrors,
                onChange: rOnChange,
                onClick: rOnClick
            }
        } = resultInstance;

        assert.strictEqual(value, model.field2);
        assert.strictEqual(name, "field2");
        expect(validationErrors.map(error => error.message)).to.be.equalTo(["one"]);
    });
});

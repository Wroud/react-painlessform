import chai, { assert, expect, use } from "chai";
import * as assertArrays from "chai-arrays";
import "mocha";
import * as React from "react";

import { mount, ReactWrapper, shallow } from "enzyme";

import { Form } from "../../src";
import { Consumer, IForm } from "../../src/components/Form";

use(assertArrays);

describe("Form", () => {
    let wrapper: ReactWrapper<any, any>;
    const values = {
        field: 1,
        field2: "kek",
    };
    const change = {
        value: 2,
        isChanged: true,
        isVisited: true,
    };
    let newValues = {};

    beforeEach(() => {
        const onModelChange = model => {
            newValues = model;
        };
        wrapper = mount(
            <Form values={values} onModelChange={onModelChange}>
                <Consumer>
                    {context => {
                        const event = () => context.handleChange("field", change);
                        return (
                            <div>
                                <button onClick={context.handleReset} id="reset" />
                                <button onClick={event} id="change" />
                            </div>
                        );
                    }}
                </Consumer>
            </Form>,
        );
    });

    it("correct state", () => {
        const {
            props: { values: v },
            state: { model },
        } = wrapper.instance() as IForm<typeof values>;

        assert.strictEqual(v.field, values.field);
        assert.strictEqual(v.field2, values.field2);
        assert.strictEqual(model.field.value, values.field);
        assert.strictEqual(model.field2.value, values.field2);
    });

    it("simulate submit", () => {
        wrapper.find("form").simulate("submit");

        const {
            state: { model },
        } = wrapper.instance() as IForm<typeof values>;

        assert.strictEqual(model.field.isVisited, true);
        assert.strictEqual(model.field2.isVisited, true);
    });

    it("simulate reset", () => {
        wrapper.find("#reset").simulate("click");
        wrapper.setProps({ values: undefined, isReset: true });

        const {
            state: { model },
        } = wrapper.instance() as IForm<typeof values>;

        const resetField = {
            value: "" as any,
            isChanged: false,
            isVisited: false,
        };
        assert.deepEqual(model.field, resetField);
        assert.deepEqual(model.field2, resetField);
    });

    it("simulate change", () => {
        wrapper.find("#change").simulate("click");
        wrapper.setProps({ values: newValues });

        const {
            state: { model },
        } = wrapper.instance() as IForm<typeof values>;

        assert.deepEqual(model.field, change);
    });
});

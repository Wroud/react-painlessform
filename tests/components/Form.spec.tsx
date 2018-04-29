import chai, { assert, expect, use } from "chai";
import * as assertArrays from "chai-arrays";
import "mocha";
import * as React from "react";

import { mount, ReactWrapper, shallow } from "enzyme";

import { createFormFactory, IFieldState } from "../../src";
import { IForm, IFormProps, IFormState } from "../../src/components/Form";
import { getValuesFromModel } from "../../src/helpers/form";
import { FormModel } from "../../src/interfaces/form";

use(assertArrays);

describe("Form", () => {
    interface IModel {
        field: number;
        field2: string;
        min: number;
        max: number;
    }

    const { Form, Field, Validation, Transform, FormContext } = createFormFactory<IModel>();

    let wrapper: ReactWrapper<any, any>;
    const values: IModel = {
        field: 1,
        field2: "kek",
        min: 0,
        max: 1,
    };
    let newValues = {};
    let isReset = false;
    let isSubmitted = false;
    let submittedValues = {};

    const MountField = ({ name }) => (
        <Field name={name}>
            {({
                value,
                onClick,
                onChange,
                rest,
            }) => (
                    <input name={name} value={value} onClick={onClick} onChange={onChange} {...rest} />
                )}
        </Field>
    );

    const transformer = (_values: Partial<FormModel<IModel>>, model: FormModel<IModel>): Partial<FormModel<IModel>> => {
        if ("min" in _values && model.max) {
            // tslint:disable-next-line:radix
            if (parseInt(_values.min.value as any) > parseInt(model.max.value as any)) {
                return {
                    max: { value: _values.min.value },
                } as any;
            }
        }
        if ("max" in _values && model.min) {
            // tslint:disable-next-line:radix
            if (parseInt(_values.max.value as any) < parseInt(model.min.value as any)) {
                return {
                    min: { value: _values.max.value },
                } as any;
            }
        }
        return {};
    };
    const onModelChange = model => {
        newValues = model;
    };
    const onSubmit = () => model => {
        isSubmitted = true;
        submittedValues = model;
    };
    const onReset = () => {
        isReset = true;
    };

    beforeEach(() => {
        wrapper = mount(
            <Form initValues={values} onSubmit={onSubmit} onReset={onReset} onModelChange={onModelChange}>
                <FormContext>
                    {context => {
                        return (
                            <div>
                                <MountField name={"field"} />
                                <MountField name={"field2"} />
                                <Transform transformer={transformer}>
                                    <MountField name={"min"} />
                                    <MountField name={"max"} />
                                </Transform>
                                <button onClick={context.handleReset} id="reset" />
                            </div>
                        );
                    }}
                </FormContext>
            </Form>,
        );
    });

    it("does mount with init values to state model", () => {
        const {
            props: { values: v },
            state: { model },
        } = wrapper.instance() as IForm<IModel>;

        assert.deepEqual(values, getValuesFromModel(model));
    });

    it("does set fields visited after submit", () => {
        wrapper.find("form").simulate("submit");

        const {
            state: { model },
        } = wrapper.instance() as IForm<IModel>;

        Object.keys(model).forEach(key => {
            assert.strictEqual(model[key].isVisited, true);
        });
        assert.deepEqual(values, submittedValues);
        assert.strictEqual(isSubmitted, true);
    });

    it("does set initValues to model after reset and isChanged & isVisited to false", () => {
        wrapper.find("#reset").simulate("click");
        // wrapper.setProps({ values: undefined, isReset: true });

        const {
            state: { model },
        } = wrapper.instance() as IForm<IModel>;

        const resetField = {
            value: "" as any,
            isChanged: false,
            isVisited: false,
        };
        assert.deepEqual(values, getValuesFromModel(model));

        Object.keys(model).forEach(key => {
            assert.strictEqual(model[key].isVisited || false, false);
            assert.strictEqual(model[key].isChanged || false, false);
        });
        assert.strictEqual(isSubmitted, true);
    });

    it("does update model after input changed", () => {
        wrapper.find("input[name='field2']").simulate("change", { target: { value: "TestValue" } });

        const {
            state: { model },
        } = wrapper.instance() as IForm<IModel>;

        assert.strictEqual(wrapper.find("input[name='field2']").props().value, "TestValue");
        assert.strictEqual(model.field2.value, "TestValue");
        assert.strictEqual(model.field2.isChanged, true);
        assert.strictEqual(model.field2.isVisited, true);
    });

    it("does transform correctly", () => {
        wrapper.find("input[name='max']").simulate("change", { target: { value: "12" } });
        wrapper.find("input[name='min']").simulate("change", { target: { value: "60" } });

        const {
            state: { model },
        } = wrapper.instance() as IForm<IModel>;

        assert.strictEqual(model.min.value, "60" as any);
        assert.strictEqual(model.max.value, "60" as any);

        wrapper.find("input[name='max']").simulate("change", { target: { value: "12" } });

        const {
            state: { model: model2 },
        } = wrapper.instance() as IForm<IModel>;

        assert.strictEqual(model2.min.value, "12" as any);
        assert.strictEqual(model2.max.value, "12" as any);

        wrapper.find("input[name='max']").simulate("change", { target: { value: "20" } });

        const {
            state: { model: model3 },
        } = wrapper.instance() as IForm<IModel>;

        assert.strictEqual(model3.min.value, "12" as any);
        assert.strictEqual(model3.max.value, "20" as any);
    });

    it("does field remounts correct", () => {
        wrapper.setState(({ model: { field2, ...newModel } }) => ({
            model: newModel,
        }));

        const {
            state: { model },
        } = wrapper.instance() as IForm<IModel>;
        assert.strictEqual(wrapper.find("input[name='field2']").props().value, "");
        assert.strictEqual(model.field2.value, "");
        assert.strictEqual(model.field2.isChanged, false);
        assert.strictEqual(model.field2.isVisited, false);
    });

    it("does field mounts correct", () => {
        wrapper = mount(
            <Form onModelChange={onModelChange}>
                <FormContext>
                    {context => {
                        return (
                            <div>
                                <MountField name={"field"} />
                                <MountField name={"field2"} />
                                <Transform transformer={transformer}>
                                    <MountField name={"min"} />
                                    <MountField name={"max"} />
                                </Transform>
                                <button onClick={context.handleReset} id="reset" />
                            </div>
                        );
                    }}
                </FormContext>
            </Form>,
        );

        const {
            state: { model },
        } = wrapper.instance() as IForm<IModel>;

        Object.keys(values).forEach(key => {
            assert.strictEqual(wrapper.find(`input[name='${key}']`).props().value, "");
            assert.strictEqual(model[key].value, "");
            assert.strictEqual(model[key].isChanged, false);
            assert.strictEqual(model[key].isVisited, false);
        });
    });
});

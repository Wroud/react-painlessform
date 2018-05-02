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
    interface IProps {
        name: any;
        type: string;
        multiple?: boolean;
        index?: number;
        value?: any;
    }
    interface IModel {
        field: number;
        field2: string;
        field3: boolean;
        field4: string[];
        field5: string[];
        field6: string;
        min: number;
        max: number;
        select: string;
        select2: string[];
    }

    const { Form, Field, Validation, Transform, FieldContext, FormContext } = createFormFactory<IModel>();

    let wrapper: ReactWrapper<any, any>;
    const values: IModel = {
        field: 1,
        field2: "kek",
        field3: false,
        field4: ["gologo", "shui"],
        field5: ["hm1"],
        field6: "hhm1",
        min: 0,
        max: 1,
        select: "2",
        select2: ["1", "2"]
    };
    const transformTestValue = -2232;
    let newValues = {};
    let isReset = false;
    let isSubmitted = false;
    let submittedValues = {};

    let rand = -1;

    const MountField = ({ name, type, value, index }: IProps) => {
        rand++;
        if (rand % 2 === 0) {
            return (
                <Field name={name} type={type} value={value} index={index}>
                    {({ inputHook }) => <input {...inputHook} />}
                </Field>
            );
        } else {
            return (
                <Field name={name} type={type} value={value} index={index}>
                    <FieldContext>{({ inputHook }) => <input {...inputHook} />}</FieldContext>
                </Field>
            );
        }
    };
    const MountSelect = ({ name, type, multiple }: IProps) => (
        <Field type={type} name={name} multiple={multiple}>
            {({ inputHook }) => (
                <select {...inputHook}>
                    <option value="1">Hm</option>
                    <option value="2">Hm</option>
                    <option value="3">Hm</option>
                </select>
            )}
        </Field>
    );

    const transformer = (_values: Partial<FormModel<IModel>>, model: FormModel<IModel>): Partial<FormModel<IModel>> => {
        if ("min" in _values && model.max) {
            if (_values.min.value > model.max.value) {
                return {
                    max: { value: _values.min.value }
                } as any;
            }
        }
        if ("max" in _values && model.min) {
            if (_values.max.value < model.min.value) {
                return {
                    min: { value: _values.max.value }
                } as any;
            }
        }
        return {};
    };

    const transformer2 = (_values: Partial<FormModel<IModel>>, model: FormModel<IModel>): Partial<FormModel<IModel>> => {
        if ("field" in _values) {
            if (model.field && model.max && _values.field.value !== model.field.value) {
                return {
                    max: { value: transformTestValue }
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

    // tslint:disable-next-line:no-shadowed-variable
    const ExForm = ({ initValues, values, onSubmit, onReset, onModelChange }: IFormProps<IModel>) => (
        <Form initValues={initValues} values={values} onSubmit={onSubmit} onReset={onReset} onModelChange={onModelChange}>
            <FormContext>
                {context => (
                    <React.Fragment>
                        <MountSelect type={"select"} name={"select"} multiple={false} />
                        <MountSelect type={"select"} name={"select2"} multiple={true} />
                        {!context.unmount ? <MountField type={"number"} name={"field"} /> : null}
                        <MountField type={"checkbox"} value={"hm0"} name={"field5"} index={0} />
                        {!context.unmount ? <MountField type={"checkbox"} value={"hm1"} name={"field5"} index={1} /> : null}
                        <MountField type={"checkbox"} value={"hm2"} name={"field5"} index={2} />
                        <MountField type={"radio"} value={"hhm0"} name={"field6"} />
                        {!context.unmount ? <MountField type={"radio"} value={"hhm1"} name={"field6"} /> : null}
                        <MountField type={"radio"} value={"hhm2"} name={"field6"} />
                        <MountField type={"text"} name={"field4"} index={0} />
                        {!context.unmount ? <MountField type={"text"} name={"field4"} index={1} /> : null}
                        <MountField type={"text"} name={"field4"} index={2} />
                        <Transform transformer={transformer2}>
                            <MountField type={"text"} name={"field2"} />
                            <MountField type={"checkbox"} value={"hm"} name={"field3"} />
                            <Transform transformer={transformer}>
                                <MountField type={"number"} name={"min"} />
                                <MountField type={"number"} name={"max"} />
                            </Transform>
                        </Transform>
                        <button type="reset" id="reset" />
                    </React.Fragment>
                )}
            </FormContext>
        </Form>
    );

    beforeEach(() => {
        wrapper = mount(ExForm({ initValues: values, onSubmit, onReset, onModelChange }));
    });

    it("does mount with init values to state model", () => {
        const {
            props: { values: v },
            state: { model }
        } = wrapper.instance() as IForm<IModel>;

        assert.deepEqual(values, getValuesFromModel(model));

        Object.keys(values).forEach(key => {
            const inputs = wrapper.find(`input[name='${key}']`);
            inputs.forEach((input, index) => {
                const type = input.props().type;
                if (/checkbox/.test(type)) {
                    if (inputs.length === 1) {
                        expect(input.props().checked).to.be.equal(values[key] || false);
                    } else {
                        expect(input.props().checked).to.be.equal(values[key].some(val => val === input.props().value));
                    }
                } else if (/radio/.test(type)) {
                    expect(input.props().checked).to.be.equal(input.props().value === values[key]);
                } else {
                    const value = inputs.length > 1 ? values[key][index] : values[key];
                    expect(input.props().value).to.be.equal(value === undefined ? "" : value);
                }
            });
        });
    });

    it("does field mounts correct without init values", () => {
        wrapper = mount(ExForm({ onModelChange }));

        const {
            state: { model }
        } = wrapper.instance() as IForm<IModel>;

        Object.keys(values).forEach(key => {
            const inputs = wrapper.find(`input[name='${key}']`);
            inputs.forEach((input, index) => {
                const type = input.props().type;
                if (/checkbox/.test(type)) {
                    if (inputs.length === 1) {
                        expect(input.props().checked).to.be.equal(false);
                    } else {
                        expect(input.props().checked).to.be.equal(false);
                    }
                } else if (/radio/.test(type)) {
                    expect(input.props().checked).to.be.equal(false);
                } else {
                    expect(input.props().value).to.be.equal("");
                }
            });
            assert.strictEqual(model[key].isChanged, false);
            assert.strictEqual(model[key].isVisited, false);
            assert.strictEqual(model[key].isFocus, false);
        });
    });

    it("does values correct & reset", () => {
        wrapper = mount(ExForm({ values }));

        const {
            state: { model }
        } = wrapper.instance() as IForm<IModel>;

        assert.deepEqual(values, getValuesFromModel(model));

        Object.keys(values).forEach(key => {
            const inputs = wrapper.find(`input[name='${key}']`);
            inputs.forEach((input, index) => {
                const type = input.props().type;
                if (/checkbox/.test(type)) {
                    if (inputs.length === 1) {
                        expect(input.props().checked).to.be.equal(values[key] || false);
                    } else {
                        expect(input.props().checked).to.be.equal(values[key].some(val => val === input.props().value));
                    }
                } else if (/radio/.test(type)) {
                    expect(input.props().checked).to.be.equal(input.props().value === values[key]);
                } else {
                    const value = inputs.length > 1 ? values[key][index] : values[key];
                    expect(input.props().value).to.be.equal(value === undefined ? "" : value);
                }
            });
        });

        wrapper.setProps({ values: {}, isReset: true });
        const {
            state: { model: model2 }
        } = wrapper.instance() as IForm<IModel>;

        Object.keys(values).forEach(key => {
            const inputs = wrapper.find(`input[name='${key}']`);
            inputs.forEach((input, index) => {
                const type = input.props().type;
                if (/checkbox/.test(type)) {
                    if (inputs.length === 1) {
                        expect(input.props().checked).to.be.equal(false);
                    } else {
                        expect(input.props().checked).to.be.equal(false);
                    }
                } else if (/radio/.test(type)) {
                    expect(input.props().checked).to.be.equal(false);
                } else {
                    expect(input.props().value).to.be.equal("");
                }
            });
            assert.strictEqual(model[key].isChanged || false, false);
            assert.strictEqual(model[key].isVisited || false, false);
            assert.strictEqual(model[key].isFocus || false, false);
        });
    });

    it("does clean reset", () => {
        wrapper = mount(ExForm({}));
        wrapper.find("#reset").simulate("click");

        const {
            state: { model: model2 }
        } = wrapper.instance() as IForm<IModel>;

        Object.keys(values).forEach(key => {
            const inputs = wrapper.find(`input[name='${key}']`);
            inputs.forEach((input, index) => {
                const type = input.props().type;
                if (/checkbox/.test(type)) {
                    if (inputs.length === 1) {
                        expect(input.props().checked).to.be.equal(false);
                    } else {
                        expect(input.props().checked).to.be.equal(false);
                    }
                } else if (/radio/.test(type)) {
                    expect(input.props().checked).to.be.equal(false);
                } else {
                    expect(input.props().value).to.be.equal("");
                }
            });
            assert.strictEqual(model2[key].isChanged, false);
            assert.strictEqual(model2[key].isVisited, false);
            assert.strictEqual(model2[key].isFocus, false);
        });
    });

    it("does set fields visited after submit", () => {
        wrapper.find("form").simulate("submit");

        const {
            state: { model }
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
            state: { model }
        } = wrapper.instance() as IForm<IModel>;

        assert.deepEqual(values, getValuesFromModel(model));

        Object.keys(model).forEach(key => {
            assert.strictEqual(model[key].isVisited || false, false);
            assert.strictEqual(model[key].isChanged || false, false);
            assert.strictEqual(model[key].isFocus || false, false);
        });
        assert.strictEqual(isSubmitted, true);
    });

    it("does update model after input clicked / focused", () => {
        wrapper.find("input[name='field2']").simulate("click");
        wrapper.find("input[name='field2']").simulate("focus");

        const {
            state: { model }
        } = wrapper.instance() as IForm<IModel>;

        assert.strictEqual(model.field2.isFocus, true);
        assert.strictEqual(model.field2.isVisited, true);

        wrapper.find("input[name='field2']").simulate("blur");

        const {
            state: { model: model2 }
        } = wrapper.instance() as IForm<IModel>;

        assert.strictEqual(model2.field2.isFocus, false);
    });

    it("does update model after input changed", () => {
        wrapper.find("input[name='field2']").simulate("change", { target: { value: "TestValue" } });
        wrapper.find("input[name='field2']").simulate("change", { target: { value: "TestValue" } });
        wrapper.find("input[name='field3']").simulate("change", { target: { type: "checkbox", checked: true } });

        const {
            state: { model }
        } = wrapper.instance() as IForm<IModel>;

        assert.strictEqual(wrapper.find("input[name='field2']").props().value, "TestValue");
        assert.strictEqual(model.field2.value, "TestValue");
        assert.strictEqual(model.field2.isChanged, true);
        assert.strictEqual(model.field2.isVisited, true);

        assert.strictEqual(wrapper.find("input[name='field3']").props().checked, true);
        assert.strictEqual(model.field3.isChanged, true);
        assert.strictEqual(model.field3.isVisited, true);

        wrapper.find("input[name='field3']").simulate("change", { target: { type: "checkbox", checked: false } });
        assert.strictEqual(wrapper.find("input[name='field3']").props().checked, false);
    });

    it("does support multiple inputs correct", () => {

        // tslint:disable-next-line:forin
        for (const index in values.field4) {
            wrapper.find("Field[index=" + index + "]").find("input[name='field4']").simulate("change", { target: { value: "TestValue" + index } });
            assert.strictEqual(wrapper.find("Field[index=" + index + "]").find("input[name='field4']").props().value, "TestValue" + index);
        }
    });

    it("does support radio correct", () => {

        const inputs = wrapper.find("input[name='field6']");
        inputs.forEach((input, index) => {
            const value = input.props().value;
            input.simulate("change", { target: { value } });
            wrapper.find("input[name='field6']").forEach(_input => expect(_input.props().checked).to.equal(_input.props().value === value));
        });
    });

    it("does support select correct", () => {

        const select = wrapper.find("select[name='select']");
        const options = select.find("option");
        options.forEach((option, index) => {
            const value = option.props().value;
            select.simulate("change", { target: { value } });
            expect(wrapper.find("select[name='select']").props().value).to.equal(value);
        });

        const select2 = wrapper.find("select[name='select2']");
        const options2 = select2.find("option");
        let selectedOptions = [];
        options2.forEach(option => {
            selectedOptions = [...selectedOptions, option.props().value];
            select2.simulate("change",
                {
                    target:
                        {
                            options: [...selectedOptions.map(val => ({ value: val, selected: true }))]
                        }
                });
            expect(wrapper.find("select[name='select2']").props().value).to.equalTo(selectedOptions);
        });
    });

    it("does field unmounts correct", () => {

        // const values: IModel = {
        //     field: 1, // unmounted
        //     field2: "kek",
        //     field3: false,
        //     field4: ["gologo", "shui"], // shui unmounted
        //     field5: ["hm1"], // hm1 unmounted
        //     field6: "hhm1", // unmounted
        //     min: 0,
        //     max: 1
        // };
        wrapper.setState({ unmount: true });
        const {
            state: { model }
        } = wrapper.instance() as IForm<IModel>;
        expect(model.field).to.be.equal(undefined);
        expect(model.field4.value).to.be.equalTo(["gologo", "", ""]);
        expect(model.field5.value).to.be.equalTo([]);
        expect(model.field6.value).to.be.equal("");
    });

    it("does transform correct", () => {
        wrapper.find("input[name='field']").simulate("change", { target: { value: 15 } });

        const {
            state: { model }
        } = wrapper.instance() as IForm<IModel>;

        assert.strictEqual(wrapper.find("input[name='field']").props().value, 15);
        assert.strictEqual(model.field.value, 15);
        assert.strictEqual(model.field.isChanged, true);
        assert.strictEqual(model.field.isVisited, true);

        assert.strictEqual(model.max.value, transformTestValue);
        assert.strictEqual(model.max.isChanged, true);
        assert.strictEqual(model.min.value, transformTestValue);
        assert.strictEqual(model.min.isChanged, true);
    });

    it("does transform correctly", () => {
        wrapper.find("input[name='max']").simulate("change", { target: { value: "12" } });
        wrapper.find("input[name='min']").simulate("change", { target: { value: "60" } });

        const {
            state: { model }
        } = wrapper.instance() as IForm<IModel>;

        assert.strictEqual(model.min.value, 60);
        assert.strictEqual(model.max.value, 60);

        wrapper.find("input[name='max']").simulate("change", { target: { value: "12" } });

        const {
            state: { model: model2 }
        } = wrapper.instance() as IForm<IModel>;

        assert.strictEqual(model2.min.value, 12);
        assert.strictEqual(model2.max.value, 12);

        wrapper.find("input[name='max']").simulate("change", { target: { value: "20" } });

        const {
            state: { model: model3 }
        } = wrapper.instance() as IForm<IModel>;

        assert.strictEqual(model3.min.value, 12);
        assert.strictEqual(model3.max.value, 20);
    });

    it("does field remounts correct", () => {
        wrapper.setState(({ model: { field2, ...newModel } }) => ({
            model: newModel
        }));

        const {
            state: { model }
        } = wrapper.instance() as IForm<IModel>;
        assert.strictEqual(wrapper.find("input[name='field2']").props().value, "");
        assert.strictEqual(model.field2.value, "");
        assert.strictEqual(model.field2.isChanged, false);
        assert.strictEqual(model.field2.isVisited, false);
        assert.strictEqual(model.field2.isFocus, false);
    });
});

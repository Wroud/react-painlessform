import chai, { assert, expect, use } from "chai";
import "mocha";
import * as React from "react";

import { mount, ReactWrapper, shallow } from "enzyme";

import { createFormFactory } from "../../src";
import { IForm, IFormProps } from "../../src/components/Form";
import { FieldSelector, IUpdateEvent } from "../../src/interfaces/field";
import { IFormStorage } from "../../src/interfaces/form";

describe("Form", () => {
    interface IProps {
        name: (model: IModel) => any;
        type: string;
        multiple?: boolean;
        value?: any;
    }
    interface IModel {
        field: number;
        field2: string;
        field3: boolean;
        field4: string[];
        field5: string[];
        field6: string;
        scope: {
            min: number;
            max: number;
        };
        selectors: {
            select: string;
            select2: string[];
        };
    }

    const { Form, Field, Validation, Transform, Scope, FieldContext, FormContext } = createFormFactory<IModel>();

    let wrapper: ReactWrapper<any, any>;
    const values: IModel = {
        field: 1,
        field2: "kek",
        field3: false,
        field4: ["gologo", "shui"],
        field5: ["hm1"],
        field6: "hhm1",
        scope: { min: 0, max: 1 },
        selectors: {
            select: "2",
            select2: ["1", "2"]
        }
    };
    const expectedValues: IModel = {
        field: 1,
        field2: "kek",
        field3: false,
        field4: ["gologo", "shui", ""],
        field5: ["hm1"],
        field6: "hhm1",
        scope: { min: 0, max: 1 },
        selectors: {
            select: "2",
            select2: ["1", "2"]
        }
    };
    const expectedDefault: IModel = {
        field: 0,
        field2: "",
        field3: false,
        field4: ["", "", ""],
        field5: [],
        field6: "",
        scope: { min: 0, max: 0 },
        selectors: {
            select: "",
            select2: []
        }
    };
    const transformTestValue = -2232;
    let newValues = {};
    let isReset = false;
    let isSubmitted = false;
    let submittedValues = {};

    let rand = -1;

    const MountField = ({ name, type, value, multiple }: IProps) => {
        rand++;
        if (rand % 2 === 0) {
            return (
                <Field name={name} type={type} value={value} multiple={multiple}>
                    {({ inputHook }) => <input {...inputHook} />}
                </Field>
            );
        } else {
            return (
                <Field name={name} type={type} value={value} multiple={multiple}>
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

    function* transformer(event: IUpdateEvent, is: (field: FieldSelector<IModel["scope"]>) => boolean, { values: v }: IFormStorage<IModel["scope"]>): IterableIterator<IUpdateEvent> {
        if (is(f => f.min) && event.value > (!v ? 0 : v.max)) {
            yield {
                selector: f => f.max,
                value: event.value
            };
        }
        if (is(f => f.max) && event.value < (!v ? 0 : v.min)) {
            yield {
                selector: f => f.min,
                value: event.value
            };
        }
        yield event;
    }

    function* transformer2(event: IUpdateEvent, is: (field: FieldSelector<IModel>, strict: boolean) => boolean, { values: v }: IFormStorage<IModel>): IterableIterator<IUpdateEvent> {
        if (is(f => f.field, true) && event.value !== v.field && event.value === 15) {
            yield {
                selector: f => f.scope.max,
                value: transformTestValue
            };
        }
        yield event;
    }
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
                        {!context.storage.unmount ? <MountField name={f => f.field} type={"number"} /> : null}
                        <Transform transformer={transformer2}>
                            <MountField name={f => f.field2} type={"text"} />
                            <MountField name={f => f.field3} type={"checkbox"} value={"hm"} />
                            {!context.storage.unmount ? (<Scope scope={f => f.scope}>
                                <Transform transformer={transformer}>
                                    <MountField type={"number"} name={f => f.min} />
                                    <MountField type={"number"} name={f => f.max} />
                                </Transform>
                            </Scope>) : null}
                        </Transform>
                        <MountField name={f => f.field4[0]} type={"text"} />
                        {!context.storage.unmount ? <MountField name={f => f.field4[1]} type={"text"} /> : null}
                        <MountField name={f => f.field4[2]} type={"text"} />
                        <MountField name={f => f.field5} type={"checkbox"} value={"hm0"} multiple={true} />
                        {!context.storage.unmount ? <MountField name={f => f.field5} type={"checkbox"} value={"hm1"} multiple={true} /> : null}
                        <MountField name={f => f.field5} type={"checkbox"} value={"hm2"} multiple={true} />
                        <MountField name={f => f.field6} type={"radio"} value={"hhm0"} />
                        {!context.storage.unmount ? <MountField name={f => f.field6} type={"radio"} value={"hhm1"} /> : null}
                        <MountField name={f => f.field6} type={"radio"} value={"hhm2"} />
                        <MountSelect name={f => f.selectors.select} type={"select"} multiple={false} />
                        <MountSelect name={f => f.selectors.select2} type={"select"} multiple={true} />
                        <button type="reset" id="reset" />
                    </React.Fragment>
                )}
            </FormContext>
        </Form>
    );

    const testValues = (model: IModel) => {
        expect(wrapper.find(`input[name='field']`).props().value)
            .to.be.equal(model.field);
        expect(wrapper.find(`input[name='field2']`).props().value)
            .to.be.equal(model.field2);
        expect(wrapper.find(`input[name='field3']`).props().checked)
            .to.be.equal(model.field3);
        expect(wrapper.find(`input[name='scope.min']`).props().value)
            .to.be.equal(model.scope.min);
        expect(wrapper.find(`input[name='scope.max']`).props().value)
            .to.be.equal(model.scope.max);
        expect(wrapper.find(`input[name='field4[0]']`).props().value)
            .to.be.equal(model.field4[0]);
        expect(wrapper.find(`input[name='field4[1]']`).props().value)
            .to.be.equal(model.field4[1]);
        expect(wrapper.find(`input[name='field4[2]']`).props().value)
            .to.be.equal(model.field4[2]);
        wrapper.find(`input[name='field5']`).forEach(input => {
            expect(input.props().checked)
                .to.be.equal(model.field5.indexOf(input.props().value as string) !== -1);
        });
        wrapper.find(`input[name='field6']`).forEach(input => {
            expect(input.props().checked)
                .to.be.equal(model.field6 === input.props().value);
        });
        expect(wrapper.find(`select[name='selectors.select']`).props().value)
            .to.be.equal(model.selectors.select);
        expect(wrapper.find(`select[name='selectors.select2']`).props().value)
            .to.be.equalTo(model.selectors.select2);
    };

    beforeEach(() => {
        wrapper = mount(ExForm({ initValues: values, onSubmit, onReset, onModelChange }));
    });

    it("does mount with init values to state model", () => {
        const {
            props: { values: v },
            getStorage
        } = wrapper.instance() as any as IForm<IModel>;

        // console.log(getStorage.values);
        assert.deepEqual(getStorage.values, expectedValues);

        testValues(expectedValues);
    });

    it("does field mounts correct without init values", () => {
        wrapper = mount(ExForm({ onModelChange }));

        const {
            getStorage
        } = wrapper.instance() as IForm<IModel>;

        // console.log(getStorage.values);
        assert.deepEqual(getStorage.values, expectedDefault);

        testValues(expectedDefault);
    });

    it("does values correct & reset", () => {
        wrapper = mount(ExForm({ values }));

        const {
            getStorage: storage
        } = wrapper.instance() as IForm<IModel>;

        // console.log(storage.values);
        assert.deepEqual(storage.values, expectedValues);

        testValues(storage.values);

        wrapper.setProps({ values: {}, isReset: true });
        const { getStorage } = wrapper.instance() as IForm<IModel>;

        // console.log(getStorage.values);
        testValues(expectedDefault);
    });

    it("does clean reset", () => {
        wrapper = mount(ExForm({ initValues: values }));
        wrapper.find("#reset").simulate("click");

        const {
            getStorage: storage
        } = wrapper.instance() as IForm<IModel>;

        // console.log(storage.values);
        assert.deepEqual(storage.values, expectedValues);

        testValues(expectedValues);
    });

    it("does set fields visited after submit", () => {
        wrapper.find("form").simulate("submit");

        const {
            getStorage: { state },
            getFields
        } = wrapper.instance() as IForm<IModel>;

        // getFields.forEach(({ props: { name } }) => {
        //     assert.strictEqual(name(state as any).isVisited, true);
        // });
        assert.deepEqual(expectedValues, submittedValues);
        assert.strictEqual(isSubmitted, true);
    });

    it("does set initValues to model after reset and isChanged & isVisited to false", () => {
        wrapper.find("form").simulate("reset");
        // wrapper.find("#reset").simulate("click");
        // wrapper.setProps({ values: undefined, isReset: true });

        const {
            getStorage: { state, values: v },
            getFields
        } = wrapper.instance() as IForm<IModel>;

        assert.deepEqual(v, expectedValues);

        getFields.forEach(({ props: { name } }) => {
            assert.strictEqual(name(state as any).isVisited || false, false);
            assert.strictEqual(name(state as any).isChanged || false, false);
            assert.strictEqual(name(state as any).isFocus || false, false);
        });
    });

    it("does update model after input clicked / focused", () => {
        wrapper.find("input[name='field2']").simulate("click");
        wrapper.find("input[name='field2']").simulate("focus");

        const {
            getStorage: { state: model }
        } = wrapper.instance() as IForm<IModel>;

        assert.strictEqual(model.field2.isFocus, true);
        assert.strictEqual(model.field2.isVisited, true);

        wrapper.find("input[name='field2']").simulate("blur");

        const {
            getStorage: { state: model2 }
        } = wrapper.instance() as IForm<IModel>;

        assert.strictEqual(model2.field2.isFocus, false);
    });

    it("does update model after input changed", () => {
        wrapper.find("input[name='field2']").simulate("change", { target: { value: "TestValue" } });
        wrapper.find("input[name='field2']").simulate("change", { target: { value: "TestValue" } });
        wrapper.find("input[name='field3']").simulate("change", { target: { type: "checkbox", checked: true } });

        const {
            getStorage: { state: model, values: v }
        } = wrapper.instance() as IForm<IModel>;
        // wrapper.find("FieldClass").forEach(f => console.log(f.props().isChanged));

        assert.strictEqual(wrapper.find("input[name='field2']").props().value, "TestValue");
        assert.strictEqual(v.field2, "TestValue");
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
            wrapper.find(`input[name='field4[${index}]']`).simulate("change", { target: { value: "TestValue" + index } });
            assert.strictEqual(wrapper.find(`input[name='field4[${index}]']`).props().value, "TestValue" + index);
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
        //     min: 0, //
        //     max: 1 //
        // };
        ((wrapper.instance() as IForm<IModel>).getStorage as any).unmount = true;
        wrapper.setProps({});
        const {
            getStorage: { values: model }
        } = wrapper.instance() as IForm<IModel>;
        // console.log(model);
        expect(model.field).to.be.equal(undefined);
        expect(model.field4).to.be.equalTo(["gologo", "", ""]);
        expect(model.field5).to.be.equalTo([]);
        expect(model.field6).to.be.equal("");
        ((wrapper.instance() as IForm<IModel>).getStorage as any).unmount = false;
    });

    it("does transform correct", () => {
        wrapper.find("input[name='field']").simulate("change", { target: { value: 15 } });

        const {
            getStorage: { values: model, state }
        } = wrapper.instance() as IForm<IModel>;

        // console.log(model);

        assert.strictEqual(wrapper.find("input[name='field']").props().value, 15);
        assert.strictEqual(model.field, 15);
        assert.strictEqual(state.field.isChanged, true);
        assert.strictEqual(state.field.isVisited, true);

        assert.strictEqual(model.scope.max, transformTestValue);
        assert.strictEqual(state.scope.max.isChanged, true);
        assert.strictEqual(model.scope.min, transformTestValue);
        assert.strictEqual(state.scope.min.isChanged, true);
    });

    it("does transform correctly", () => {
        wrapper.find("input[name='scope.max']").simulate("change", { target: { value: "12" } });
        wrapper.find("input[name='scope.min']").simulate("change", { target: { value: "60" } });

        const {
            getStorage: { values: model }
        } = wrapper.instance() as IForm<IModel>;

        assert.strictEqual(model.scope.min, 60);
        assert.strictEqual(model.scope.max, 60);

        wrapper.find("input[name='scope.max']").simulate("change", { target: { value: "12" } });

        const {
            getStorage: { values: model2 }
        } = wrapper.instance() as IForm<IModel>;

        assert.strictEqual(model2.scope.min, 12);
        assert.strictEqual(model2.scope.max, 12);

        wrapper.find("input[name='scope.max']").simulate("change", { target: { value: "20" } });

        const {
            getStorage: { values: model3 }
        } = wrapper.instance() as IForm<IModel>;

        assert.strictEqual(model3.scope.min, 12);
        assert.strictEqual(model3.scope.max, 20);
    });

    it("does field remounts correct", () => {
        const storage = (wrapper.instance() as IForm<IModel>).getStorage;

        delete storage.values.field2;
        delete storage.state.field2;
        wrapper.setProps({});

        const {
            getStorage: { values: model, state }
        } = wrapper.instance() as IForm<IModel>;
        assert.strictEqual(wrapper.find("input[name='field2']").props().value, "");
        assert.strictEqual(model.field2, "");
        assert.strictEqual(state.field2.isChanged, false);
        assert.strictEqual(state.field2.isVisited, false);
        assert.strictEqual(state.field2.isFocus, false);
    });
});

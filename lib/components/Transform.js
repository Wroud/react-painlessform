"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const __1 = require("..");
const form_1 = require("../helpers/form");
const tools_1 = require("../tools");
_a = React.createContext(undefined), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
/**
 * Transform is React Component that accpts [[ITranformProps]] as props
 * and passes [[transformer]] function as [[TransformContext]]
 */
class Transform extends React.Component {
    constructor() {
        super(...arguments);
        this.transformers = [];
        this.transform = (events, state) => {
            const { transformer } = this.props;
            const { scope } = this;
            let next = events;
            if (transformer) {
                // const valuesScope = fromProxy(autoCreateProxy(state.values), scope((f: TModel) => f));
                // const stateScope = fromProxy(autoCreateProxy(state.state), scope((f: FieldsState<TModel>) => f));
                // const validationScope = fromProxy(autoCreateProxy(state.validation), scope((f: IValidationState<TModel>) => f));
                const valuesScope = scope((f) => f)(state.values);
                const stateScope = scope((f) => f)(state.state);
                const validationScope = scope((f) => f)(state.validation);
                function* addScope(event, ignore) {
                    if (event.global || event !== ignore) {
                        event.selector = scope(event.selector);
                    }
                    yield event;
                }
                next = tools_1.exchangeIterator(next, event => tools_1.exchangeIterator(transformer(event, form_1.isField(state.values, event, scope), Object.assign({}, state, { values: valuesScope, state: stateScope, validation: validationScope })), e => addScope(e, event)));
            }
            this.transformers.forEach(({ transform }) => {
                next = transform(next, state);
            });
            return next;
        };
        this.scope = s => s;
        this.mountTransform = (value) => {
            this.transformers.push(value);
        };
        this.unMountTransform = (value) => {
            const id = this.transformers.indexOf(value);
            if (id > -1) {
                this.transformers.splice(id, 1);
            }
        };
    }
    render() {
        const context = {
            mountTransform: this.mountTransform,
            unMountTransform: this.unMountTransform
        };
        const { ScopeContext } = __1.createFormFactory();
        return (React.createElement(ScopeContext, null, scope => (React.createElement(exports.Consumer, null, transform => {
            this._context = transform;
            this.scope = scope;
            return React.createElement(exports.Provider, { value: context }, this.props.children);
        }))));
    }
    componentDidMount() {
        if (this._context) {
            this._context.mountTransform(this);
        }
    }
    componentWillUnmount() {
        if (this._context) {
            this._context.unMountTransform(this);
        }
    }
}
exports.Transform = Transform;
var _a;
//# sourceMappingURL=Transform.js.map
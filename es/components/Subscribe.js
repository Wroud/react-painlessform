"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const formFactory_1 = require("../helpers/formFactory");
const Path_1 = require("../Path");
_a = React.createContext(undefined), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
class Subscribe extends React.Component {
    constructor(props) {
        super(props);
        this.subscribers = [];
        this.subscriptions = [];
        this.subscribe = (value) => {
            this.subscribers.push(value);
        };
        this.unSubscribe = (value) => {
            const id = this.subscribers.indexOf(value);
            if (id > -1) {
                this.subscribers.splice(id, 1);
            }
        };
        this.subscribeContext = {
            subscriptions: {},
            subscribe: this.subscribe,
            unSubscribe: this.unSubscribe
        };
    }
    smartUpdate(events) {
        if (events.some(f => this.subscriptions.some(s => s.includes(f)))) {
            this.forceUpdate();
            return;
        }
        for (const _validator of this.subscribers) {
            _validator.smartUpdate(events);
        }
    }
    render() {
        const { FormContext, ScopeContext } = formFactory_1.createFormFactory();
        const { to } = this.props;
        return (React.createElement(FormContext, null, formContext => (React.createElement(exports.Consumer, null, subscriberContext => (React.createElement(ScopeContext, null, scope => {
            this._context = subscriberContext;
            if (to !== undefined) {
                this.subscribeContext.subscriptions = {};
                this.subscriptions = [];
                Object.keys(to).forEach(key => {
                    const subscription = scope.join(Path_1.Path.fromSelector(to[key]));
                    this.subscriptions.push(subscription);
                    this.subscribeContext.subscriptions[key] = subscription.getValue(formContext.storage.values);
                });
            }
            return this.props.children && typeof this.props.children === "function"
                ? this.props.children(this.subscribeContext.subscriptions)
                : React.createElement(exports.Provider, { value: this.subscribeContext }, this.props.children);
        }))))));
    }
    componentDidMount() {
        if (this._context && this._context.subscribe) {
            this._context.subscribe(this);
        }
    }
    componentWillUnmount() {
        if (this._context && this._context.unSubscribe) {
            this._context.unSubscribe(this);
        }
    }
}
Subscribe.defaultProps = {
    to: {}
};
exports.Subscribe = Subscribe;
var _a;
//# sourceMappingURL=Subscribe.js.map
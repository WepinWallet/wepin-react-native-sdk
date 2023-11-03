import React, { Component } from 'react';
import Sibling from 'react-native-root-siblings';
import Dialog from './Dialog';
export default class PopupDialog extends Component {
    constructor(props) {
        super(props);
        this.handleDismiss = () => {
            const { onDismiss } = this.props;
            if (onDismiss) {
                onDismiss();
            }
            this.destroyDialog();
        };
        this.sibling = null;
        this.state = {
            visible: props.visible,
        };
    }
    componentDidMount() {
        const { visible } = this.state;
        if (visible) {
            this.createDialog();
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.visible !== this.props.visible) {
            this.setState({ visible: this.props.visible });
            if (this.props.visible) {
                this.createDialog();
            }
        }
        if (this.sibling) {
            this.updateDialog();
        }
    }
    createDialog() {
        if (!this.sibling) {
            this.sibling = new Sibling(this.renderDialog());
        }
    }
    updateDialog() {
        var _a;
        (_a = this.sibling) === null || _a === void 0 ? void 0 : _a.update(this.renderDialog());
    }
    destroyDialog() {
        var _a;
        (_a = this.sibling) === null || _a === void 0 ? void 0 : _a.destroy();
        this.sibling = null;
    }
    renderDialog() {
        return (<Dialog {...this.props} onDismiss={this.handleDismiss} visible={this.state.visible}/>);
    }
    render() {
        return null;
    }
}
//# sourceMappingURL=PopupDialog.js.map
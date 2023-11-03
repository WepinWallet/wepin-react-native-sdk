import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import PopupDialog from './PopupDialog';
const { width: screenWidth } = Dimensions.get('window');
const ANIMATION_DURATION = 200;
const DEFAULT_WIDTH = screenWidth;
const DEFAULT_HEIGHT = null;
const styles = StyleSheet.create({
    dialog: {
        elevation: 5,
        minHeight: 96,
        borderRadius: 0,
    },
    dialogContainer: {
        flex: 1,
    },
});
class DialogComponent extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.show = this.show.bind(this);
        this.dismiss = this.dismiss.bind(this);
    }
    show(onShown) {
        this.popupDialog.show(onShown);
    }
    dismiss(onDismissed) {
        this.popupDialog.dismiss(onDismissed);
    }
    render() {
        return (<PopupDialog ref={(popupDialog) => { this.popupDialog = popupDialog; }} height={this.props.height} overlayPointerEvents={this.props.overlayPointerEvents} overlayBackgroundColor={this.props.overlayBackgroundColor} onTouchOutside={this.props.onTouchOutside} hasOverlay={this.props.hasOverlay} visible={this.props.visible} onDismiss={this.props.onDismiss} webviewConfig={this.props.webviewConfig}/>);
    }
}
DialogComponent.defaultProps = {
    animationDuration: ANIMATION_DURATION,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
};
export default DialogComponent;
//# sourceMappingURL=DialogComponent.js.map
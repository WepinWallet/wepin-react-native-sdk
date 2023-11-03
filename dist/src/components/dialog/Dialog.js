import React, { Component } from 'react';
import { View, StyleSheet, Animated, Dimensions, BackHandler as RNBackHandler, } from 'react-native';
import FadeAnimation from './animation/FadeAnimations';
import WepinWebview from '../Webview';
const BackHandler = RNBackHandler;
const DIALOG_OPENING = 'opening';
const DIALOG_OPENED = 'opened';
const DIALOG_CLOSING = 'closing';
const DIALOG_CLOSED = 'closed';
const DEFAULT_ANIMATION_DURATION = 150;
const HARDWARE_BACK_PRESS_EVENT = 'hardwareBackPress';
const styles = StyleSheet.create({
    container: Object.assign(Object.assign({}, StyleSheet.absoluteFillObject), { justifyContent: 'center', alignItems: 'center', zIndex: 1000 }),
    dialog: {
        overflow: 'hidden',
    },
    hidden: {
        top: -10000,
        left: 0,
        height: 0,
        width: 0,
    },
    round: {
        borderRadius: 8,
    },
});
class Dialog extends Component {
    constructor(props) {
        super(props);
        this.show = () => {
            if (![DIALOG_OPENING, DIALOG_OPENED].includes(this.state.dialogState)) {
                this.setDialogState(1);
            }
        };
        this.dismiss = () => {
            const { onDismiss } = this.props;
            if (![DIALOG_CLOSING, DIALOG_CLOSED].includes(this.state.dialogState)) {
                this.setDialogState(0, onDismiss);
            }
        };
        this.state = {
            dialogAnimation: new FadeAnimation({ animationDuration: DEFAULT_ANIMATION_DURATION }),
            dialogState: DIALOG_CLOSED,
        };
    }
    componentDidMount() {
        const { visible } = this.props;
        if (visible) {
            this.show();
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.visible !== prevProps.visible) {
            if (this.props.visible) {
                this.show();
            }
            this.dismiss();
        }
    }
    get pointerEvents() {
        const { overlayPointerEvents } = this.props;
        const { dialogState } = this.state;
        if (overlayPointerEvents) {
            return overlayPointerEvents;
        }
        return dialogState === DIALOG_OPENED ? 'auto' : 'none';
    }
    get dialogSize() {
        const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
        let { width, height } = { width: screenWidth, height: screenHeight };
        return { width, height };
    }
    setDialogState(toValue, callback) {
        const { dialogAnimation } = this.state;
        let dialogState = toValue ? DIALOG_OPENING : DIALOG_CLOSING;
        dialogAnimation.toValue(toValue);
        this.setState({ dialogState });
        setTimeout(() => {
            dialogState = dialogState === DIALOG_CLOSING ? DIALOG_CLOSED : DIALOG_OPENED;
            this.setState({ dialogState }, callback);
        }, DEFAULT_ANIMATION_DURATION);
    }
    render() {
        var _a;
        const { dialogState, dialogAnimation } = this.state;
        const { onTouchOutside, hasOverlay, overlayBackgroundColor, } = this.props;
        let overlayVisible;
        let backgroundColor;
        if (((_a = this.props.webviewConfig) === null || _a === void 0 ? void 0 : _a.appInfo.attributes.type) !== 'show') {
            overlayVisible = false;
            backgroundColor = '#ff000000';
        }
        else {
            backgroundColor = 'rgba(0,0,0,0.4)';
            overlayVisible = hasOverlay && [DIALOG_OPENING, DIALOG_OPENED].includes(dialogState);
        }
        const hidden = dialogState === DIALOG_CLOSED && styles.hidden;
        return (<View style={[styles.container, hidden]}>
                
                <Animated.View style={[
                styles.dialog,
                {
                    backgroundColor,
                },
                this.dialogSize,
                dialogAnimation.animations,
            ]}>
                    <WepinWebview config={this.props.webviewConfig} visible={this.props.visible}/>
                    
                </Animated.View>
            </View>);
    }
}
Dialog.defaultProps = {
    visible: false,
    height: null,
    onTouchOutside: () => { },
    hasOverlay: true,
    overlayPointerEvents: null,
    overlayBackgroundColor: '#000',
    onDismiss: () => { },
    webviewConfig: null,
};
export default Dialog;
//# sourceMappingURL=Dialog.js.map
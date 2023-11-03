import React, { Component } from 'react';
import FadeAnimation from './animation/FadeAnimations';
import { IConfigWebview } from './manager/DialogManager';
declare const DIALOG_OPENING: string;
declare const DIALOG_OPENED: string;
declare const DIALOG_CLOSING: string;
declare const DIALOG_CLOSED: string;
type DialogState = typeof DIALOG_OPENING | typeof DIALOG_OPENED | typeof DIALOG_CLOSING | typeof DIALOG_CLOSED;
type State = {
    dialogAnimation: FadeAnimation;
    dialogState: DialogState;
};
export type DialogProps = {
    visible: boolean;
    height?: number;
    hasOverlay?: boolean;
    overlayPointerEvents?: 'auto' | 'none';
    overlayBackgroundColor?: string;
    onTouchOutside?: () => void;
    onDismiss?: () => void;
    webviewConfig?: IConfigWebview;
};
declare class Dialog extends Component<DialogProps, State> {
    static defaultProps: {
        visible: boolean;
        height: null;
        onTouchOutside: () => void;
        hasOverlay: boolean;
        overlayPointerEvents: null;
        overlayBackgroundColor: string;
        onDismiss: () => void;
        webviewConfig: null;
    };
    constructor(props: DialogProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: DialogProps): void;
    get pointerEvents(): 'none' | 'auto' | undefined;
    get dialogSize(): Object;
    setDialogState(toValue: number, callback?: () => void): void;
    show: () => void;
    dismiss: () => void;
    render(): React.JSX.Element;
}
export default Dialog;

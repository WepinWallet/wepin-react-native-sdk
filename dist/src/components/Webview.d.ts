import React, { Component } from 'react';
import { IConfigWebview } from './dialog/manager/DialogManager';
import NativeWebView from 'react-native-webview';
import { WepinRequestMessage, WepinResponseMessage } from '../types/Message';
export type WepinWebviewProps = {
    config: IConfigWebview;
    visible: boolean;
};
type State = {
    visible: boolean;
};
declare class WepinWebview extends Component<WepinWebviewProps, State> {
    static defaultProps: {
        config: null;
        visible: boolean;
    };
    EL: (event: import("react-native-webview").WebViewMessageEvent) => void;
    constructor(props: WepinWebviewProps);
    private _open;
    private _close;
    webRef: NativeWebView | undefined;
    private _handleSetRef;
    response: (message: WepinResponseMessage) => void;
    request: (message: WepinRequestMessage) => void;
    openUrl(url: string): Promise<void>;
    private handleWebViewLoaded;
    componentDidUpdate(prevProps: WepinWebviewProps): void;
    render(): React.JSX.Element;
}
export default WepinWebview;

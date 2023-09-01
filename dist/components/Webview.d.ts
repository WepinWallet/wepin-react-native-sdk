import * as React from 'react';
import NativeWebView from 'react-native-webview';
import { Wepin } from '../wepin';
import { WepinRequestMessage, WepinResponseMessage } from '../types/Message';
export type IConfigWebview = {
    url: string;
    wepin: Wepin;
    appInfo: {
        appKey: string;
        attributes: object;
        domain: string;
        platform: string;
        version?: string;
    };
};
type IProps = {
    config?: Pick<IConfigWebview, 'wepin'>;
};
type IState = {
    styles: ReturnType<typeof __styles>;
    visible: boolean;
    config?: IConfigWebview;
};
export declare class WebView extends React.Component<IProps, IState> {
    static instance: React.RefObject<WebView>;
    private static _wepin;
    private EL;
    static get Wepin(): Wepin | undefined;
    static show: (args: IConfigWebview) => WebView | null;
    static hide: () => void;
    private _timeout?;
    constructor(props: IProps);
    private _open;
    private _close;
    webRef: NativeWebView | undefined;
    private _handleSetRef;
    response: (message: WepinResponseMessage) => void;
    request: (message: WepinRequestMessage) => void;
    openUrl(url: string): Promise<void>;
    private _WebivewRender;
    render: () => JSX.Element;
}
declare const __styles: () => {
    backgroundContainer: {
        backgroundColor: string;
        position: "absolute";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    };
    webviewContainer: {
        flex: number;
        width: string;
        height: string | number;
        position: "absolute";
        bottom: number;
        backgroundColor: string;
    };
    webview: {
        flex: number;
        width: string;
        height: string;
        position: "absolute";
        bottom: number;
        backgroundColor: string;
    };
};
export {};

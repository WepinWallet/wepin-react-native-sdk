/// <reference types="react" />
import type { IAttributes } from '@wepin/types';
import { modeByAppKey } from './types/modeByAppKey';
import { Account } from './types/Account';
import type { WepinRequestMessage } from './types/Message';
import { WebView } from './components/Webview';
import EventEmitter from 'eventemitter3';
export declare class Wepin extends EventEmitter {
    static WidgetView: import("react").FunctionComponent<{
        webviewConfig?: Pick<import("./components/Webview").IConfigWebview, "wepin"> | undefined;
        children: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>[];
    }>;
    private static _instance;
    wepinAppId: string | undefined;
    wepinAppKey: string | undefined;
    wepinDomain: string | undefined;
    wepinAppAttributes: IAttributes | undefined;
    private _widget;
    accountInfo: Account[] | undefined;
    private _modeByAppKey;
    _isInitialized: boolean;
    queue: WepinRequestMessage[];
    static getInstance(): Wepin;
    constructor();
    setAccountInfo(accounts: Account[]): void;
    get Widget(): WebView | null | undefined;
    private setModeByAppKey;
    get modeByAppKey(): modeByAppKey;
    toJSON(): string;
    init(appId: string, appKey: string, attributes?: IAttributes): Promise<Wepin>;
    isInitialized(): boolean;
    finalize(): void;
    openWidget(): Promise<void>;
    closeWidget(): void;
    getAccounts(networks?: string[]): Promise<{
        address: string;
        network: string;
    }[] | undefined>;
}

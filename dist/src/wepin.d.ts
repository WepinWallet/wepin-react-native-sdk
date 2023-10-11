/// <reference types="react" />
import { type IAttributes, WepinLifeCycle, IWepinUser } from '@wepin/types';
import { modeByAppKey } from './types/modeByAppKey';
import { Account } from './types/Account';
import { type WepinRequestMessage } from './types/Message';
import { WebView } from './components/Webview';
import EventEmitter from './utils/safeEventEmitter';
import { SupportedChains } from './types/Provider';
export declare class Wepin extends EventEmitter {
    version: string;
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
    private _userInfo;
    private _wepinLifeCycle;
    queue: WepinRequestMessage[];
    static getInstance(): Wepin;
    constructor();
    private _initQueue;
    setAccountInfo(accounts: Account[]): void;
    get Widget(): WebView | null | undefined;
    private setModeByAppKey;
    get modeByAppKey(): modeByAppKey;
    toJSON(): string;
    init(appId: string, appKey: string, attributes?: IAttributes): Promise<Wepin>;
    isInitialized(): boolean;
    finalize(): Promise<void>;
    openWidget(): Promise<void>;
    private _open;
    private _resize;
    closeWidget(): Promise<void>;
    private _close;
    getAccounts(networks?: string[]): Promise<{
        address: string;
        network: string;
    }[] | undefined>;
    setUserInfo(userInfo: IWepinUser): void;
    getStatus(): WepinLifeCycle;
    login(): Promise<IWepinUser>;
    logout(): Promise<void>;
    getProvider({ network }: {
        network: SupportedChains;
    }): any;
}

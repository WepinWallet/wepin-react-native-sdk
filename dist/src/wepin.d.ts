import { type IAttributes, WepinLifeCycle, IWepinUser } from '@wepin/types';
import { modeByAppKey } from './types/modeByAppKey';
import { Account, DetailAccount } from './types/Account';
import { type WepinRequestMessage } from './types/Message';
import EventEmitter from './utils/safeEventEmitter';
import { SupportedChains } from './types/Provider';
import { IAccountBalance } from './types/AccountBalance';
import WebView from './components/Webview';
import { RootSiblingParent } from 'react-native-root-siblings';
export interface ISendOptions {
    toAddress: string;
    amount: string;
}
export declare class Wepin extends EventEmitter {
    #private;
    version: string;
    static WidgetView: typeof RootSiblingParent;
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
    queue: WepinRequestMessage[] | undefined;
    static getInstance(): Wepin;
    constructor();
    private _initQueue;
    setAccountInfo(accounts: Account[], detailAccount?: DetailAccount[]): void;
    get Widget(): WebView | undefined;
    private setModeByAppKey;
    get modeByAppKey(): modeByAppKey;
    toJSON(): string;
    setPermission(permission: {
        camera: boolean;
        clipboard: boolean;
    }): void;
    getPermission(): {
        camera: boolean;
        clipboard: boolean;
    };
    init(appId: string, appKey: string, attributes?: IAttributes): Promise<Wepin>;
    private isLogedIn;
    isInitialized(): boolean;
    finalize(): Promise<void>;
    openWidget(): Promise<void>;
    setWidgetWebview(webview: WebView | undefined): void;
    private _open;
    private _resize;
    closeWidget(): Promise<void>;
    private _close;
    getAccounts(networks?: string[]): Promise<{
        address: string;
        network: string;
    }[] | undefined>;
    setUserInfo(userInfo: IWepinUser, withEmit?: boolean): void;
    setWepinToken(tokens: {
        refreshToken: string;
        accessToken: string;
    }): void;
    getStatus(): WepinLifeCycle;
    login(email?: string): Promise<IWepinUser>;
    logout(): Promise<void>;
    private registerWithWidget;
    loginWithExternalToken(token: string, sign: string, withUI?: boolean): Promise<IWepinUser>;
    getProvider({ network }: {
        network: SupportedChains;
    }): any;
    signUpWithEmailAndPassword(email: string, password: string): Promise<boolean>;
    loginWithEmailAndPassword(email: string, password: string): Promise<IWepinUser>;
    register(pin: string): Promise<boolean>;
    getBalance(account: Account): Promise<IAccountBalance>;
    getSDKRequest(): WepinRequestMessage | undefined;
    send(account: Account, options?: ISendOptions): Promise<string>;
}

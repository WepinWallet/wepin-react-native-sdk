import { type modeByAppKey } from '../types/modeByAppKey';
export default class Utils {
    static getUrls(modeByAppKey: modeByAppKey): {
        wepinWebview: string;
    };
    static getDeeplink(): string;
    static checkSameNumber: (pin: string, times: number, isRegisterReqiored: boolean) => boolean;
    static setLocalStorage: (appId: string, value: unknown) => Promise<void>;
    static getLocalStorage: (appId: string) => Promise<any>;
    static clearLocalStorage: (appId: string) => Promise<void>;
    static isExpired: (token: string) => boolean;
}

import { type modeByAppKey } from '../types/modeByAppKey';
export default class Utils {
    static getUrls(modeByAppKey: modeByAppKey): {
        wepinWebview: string;
    };
    static getDeeplink(): string;
}

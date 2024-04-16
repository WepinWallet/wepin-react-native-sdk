var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { Platform } from 'react-native';
import { getBundleId } from 'react-native-device-info';
import EncryptedSotrage from 'react-native-encrypted-storage';
import { COOKIENAME } from '../const/config';
import jwtDecode from 'jwt-decode';
import Clipboard from '@react-native-clipboard/clipboard';
export default class Utils {
    static getUrls(modeByAppKey) {
        switch (modeByAppKey) {
            case 'production':
                return {
                    wepinWebview: 'https://widget.wepin.io',
                };
            case 'test':
                return {
                    wepinWebview: 'https://stage-widget.wepin.io',
                };
            case 'development':
                return {
                    wepinWebview: 'https://dev-widget.wepin.io',
                };
            default:
                throw new Error('Utils.getUrls: invalid mode');
        }
    }
    static getDeeplink() {
        const scheme = getBundleId();
        const prefix = Platform.OS === 'ios' ? `${scheme}.wepin://` : `${scheme}.wepin://`;
        return prefix;
    }
}
_a = Utils;
Utils.checkSameNumber = (pin, times, isRegisterReqiored) => {
    if (isRegisterReqiored)
        return false;
    let numArr = Array.apply(null, new Array(10)).map(Number.prototype.valueOf, 0);
    let hasSameNumber = false;
    let splitStr = [...pin];
    splitStr.forEach((pin) => {
        numArr[Number(pin)]++;
        if (numArr[Number(pin)] >= times) {
            hasSameNumber = true;
            return;
        }
    });
    return hasSameNumber;
};
Utils.setLocalStorage = (appId, value) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.stringify(value);
    yield EncryptedSotrage.setItem(COOKIENAME + appId, data);
});
Utils.getLocalStorage = (appId) => __awaiter(void 0, void 0, void 0, function* () {
    const storage = yield EncryptedSotrage.getItem(COOKIENAME + appId);
    const data = storage ? JSON.parse(storage) : undefined;
    return data;
});
Utils.clearLocalStorage = (appId) => __awaiter(void 0, void 0, void 0, function* () {
    yield EncryptedSotrage.removeItem(COOKIENAME + appId);
});
Utils.isExpired = (token) => {
    var _b;
    if (!token)
        return true;
    const expired = (_b = jwtDecode(token)) === null || _b === void 0 ? void 0 : _b.exp;
    if (expired <= Math.floor(Date.now() / 1000) + 60)
        return true;
    return false;
};
Utils.getClipboard = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Clipboard.getString();
});
//# sourceMappingURL=utils.js.map
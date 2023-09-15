import { Platform } from 'react-native';
import { getBundleId } from 'react-native-device-info';
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
//# sourceMappingURL=utils.js.map
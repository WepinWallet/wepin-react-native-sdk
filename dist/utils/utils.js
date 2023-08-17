"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var react_native_device_info_1 = require("react-native-device-info");
var Utils = (function () {
    function Utils() {
    }
    Utils.getUrls = function (modeByAppKey) {
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
    };
    Utils.getDeeplink = function () {
        var scheme = (0, react_native_device_info_1.getBundleId)();
        var prefix = react_native_1.Platform.OS === 'ios' ? "".concat(scheme, ".wepin://") : "".concat(scheme, ".wepin://");
        return prefix;
    };
    return Utils;
}());
exports.default = Utils;
//# sourceMappingURL=utils.js.map
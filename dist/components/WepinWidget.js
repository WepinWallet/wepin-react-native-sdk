"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WepinWidget = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var Webview_1 = require("./Webview");
var react_native_2 = require("react-native");
var WepinWidget = function (_a) {
    var children = _a.children, webviewConfig = _a.webviewConfig;
    var safeAreaInsetsContext = (0, react_1.useContext)(react_native_safe_area_context_1.SafeAreaInsetsContext);
    if (safeAreaInsetsContext === null) {
        return (React.createElement(react_native_1.SafeAreaView, null,
            React.createElement(react_native_1.View, { style: styles.content },
                React.createElement(React.Fragment, null,
                    React.createElement(Webview_1.WebView, { ref: Webview_1.WebView.instance, config: webviewConfig }),
                    children))));
    }
    return (React.createElement(react_native_1.View, { style: styles.content },
        React.createElement(React.Fragment, null,
            React.createElement(Webview_1.WebView, { ref: Webview_1.WebView.instance, config: webviewConfig }),
            children)));
};
exports.WepinWidget = WepinWidget;
var styles = react_native_2.StyleSheet.create({
    content: {
        flex: 1,
    },
});
//# sourceMappingURL=WepinWidget.js.map
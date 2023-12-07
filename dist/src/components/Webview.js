var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { Component } from 'react';
import { StyleSheet, Platform, View, Linking, Dimensions } from 'react-native';
import { getEventListener } from './event/eventListener';
import NativeWebView from 'react-native-webview';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Utils from '../utils/utils';
import LOG from '../utils/log';
import URLParser from 'url';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { closeWidgetAndClearWebview } from '../utils/commmonWidget';
const styles = StyleSheet.create({
    webviewContainer: {
        flex: 1,
        width: '100%',
        height: Platform.OS === 'ios' ? Dimensions.get('screen').height - getStatusBarHeight() : '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#ff000000',
    },
    webview: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#ff000000',
    },
});
class WepinWebview extends Component {
    constructor(props) {
        super(props);
        this._open = (config) => __awaiter(this, void 0, void 0, function* () {
            if (this.state.visible) {
                yield new Promise(resolve => this.setState(prevState => (Object.assign(Object.assign({}, prevState), { config })), resolve));
                return;
            }
            yield new Promise(resolve => this.setState(prevState => (Object.assign(Object.assign({}, prevState), { visible: true, config })), () => {
                resolve();
            }));
        });
        this._close = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!this.props.visible) {
                return;
            }
            if (Platform.OS === 'android' && ((_a = this.webRef) === null || _a === void 0 ? void 0 : _a.clearHistory)) {
                (_b = this.webRef) === null || _b === void 0 ? void 0 : _b.clearHistory();
            }
            const config = Object.assign(Object.assign({}, this.props.config), { url: '' });
            yield new Promise(resolve => this.setState(prevState => (Object.assign(Object.assign({}, prevState), { config, visible: false })), resolve));
            const wepin = this.props.config.wepin;
            closeWidgetAndClearWebview(wepin, this);
        });
        this._handleSetRef = (_ref) => {
            if (this.props.visible) {
                const wepin = this.props.config.wepin;
                this.webRef = _ref;
                wepin.setWidgetWebview(this);
            }
        };
        this.response = (message) => {
            var _a;
            LOG.debug('this.webRef', this.webRef);
            LOG.debug('message: ', message);
            (_a = this.webRef) === null || _a === void 0 ? void 0 : _a.postMessage(JSON.stringify(message));
        };
        this.request = (message) => {
            var _a;
            (_a = this.webRef) === null || _a === void 0 ? void 0 : _a.postMessage(JSON.stringify(message));
        };
        this.handleWebViewLoaded = (e) => {
            var _a;
            if ((_a = this.props.config) === null || _a === void 0 ? void 0 : _a.url) {
            }
        };
        this.EL = getEventListener(this);
        this.state = {
            visible: true,
        };
    }
    openUrl(url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (url.includes('/signup/email/authentication') || url.includes('/reset/email/authentication')) {
                    Linking.openURL(url);
                    return;
                }
                const isAvailable = yield InAppBrowser.isAvailable();
                if (isAvailable) {
                    const deeplink = Utils.getDeeplink();
                    const result = yield InAppBrowser.openAuth(url, deeplink, {
                        dismissButtonStyle: 'cancel',
                        preferredBarTintColor: 'gray',
                        preferredControlTintColor: 'white',
                        showTitle: true,
                        toolbarColor: '#6200EE',
                        secondaryToolbarColor: 'black',
                        enableUrlBarHiding: true,
                        enableDefaultShare: true,
                        forceCloseOnRedirection: true,
                        modalEnabled: true,
                    });
                    if (result.type === 'success' && result.url) {
                        LOG.debug('success, url: ', result.url);
                        if (result.url.includes('?token=')) {
                            const idToken = result.url.substring(deeplink.length + '?token='.length);
                            if (idToken) {
                                const urlObj = URLParser.parse(url);
                                LOG.debug('url', url);
                                LOG.debug('urlObj', urlObj);
                                const pathName = (_a = urlObj.pathname) === null || _a === void 0 ? void 0 : _a.split('/');
                                const provider = pathName ? pathName[2] : '';
                                this.request({
                                    header: {
                                        request_from: 'react-native',
                                        request_to: 'wepin_widget',
                                        id: new Date().getTime(),
                                    },
                                    body: {
                                        command: 'set_token',
                                        parameter: {
                                            token: idToken,
                                            provider
                                        },
                                    },
                                });
                                return;
                            }
                        }
                    }
                    else if (result.type === 'cancel' || result.type === 'dismiss') {
                        LOG.debug('close');
                        if (url.includes('login')) {
                            this.request({
                                header: {
                                    request_from: 'react-native',
                                    request_to: 'wepin_widget',
                                    id: new Date().getTime(),
                                },
                                body: {
                                    command: 'set_token',
                                    parameter: {
                                        token: '',
                                    },
                                },
                            });
                        }
                        return;
                    }
                }
                else {
                    Linking.openURL(url);
                }
            }
            catch (error) {
                LOG.debug(error);
            }
        });
    }
    componentDidUpdate(prevProps) {
        const { visible, config } = prevProps;
        if (visible !== this.props.visible) {
            if (visible) {
                this._open(config);
            }
            else {
                this._close();
            }
        }
    }
    render() {
        if (!this.props.config) {
            return <></>;
        }
        const { appInfo, url } = this.props.config;
        return (<View style={appInfo.attributes.type === 'show' ? styles.webviewContainer : { height: 0 }}>
                <NativeWebView ref={this._handleSetRef} source={{ uri: url }} style={appInfo.attributes.type === 'show' ? styles.webview : { height: 0 }} javaScriptEnabled={true} domStorageEnabled={true} thirdPartyCookiesEnabled={true} cacheEnabled={true} androidLayerType={'hardware'} onError={({ nativeEvent }) => {
                LOG.error('Webview error: ', nativeEvent);
                this._close();
            }} onLoad={this.handleWebViewLoaded} onMessage={this.EL} onOpenWindow={(eventData) => {
                var _a;
                const inAppUrl = (_a = eventData === null || eventData === void 0 ? void 0 : eventData.nativeEvent) === null || _a === void 0 ? void 0 : _a.targetUrl;
                LOG.debug('onOpenWindow Url : ', inAppUrl);
                this.openUrl(inAppUrl);
            }} onNavigationStateChange={webviewState => {
                var _a, _b;
                if ((_a = this.props.config) === null || _a === void 0 ? void 0 : _a.url) {
                    if (this.props.config.url.includes('wepin-sdk-login') && this.props.config.appInfo.attributes.type !== 'show') {
                        LOG.debug('webviewState.url', webviewState.url);
                        if (webviewState.url !== this.props.config.url) {
                            LOG.debug('reload!!!');
                            (_b = this.webRef) === null || _b === void 0 ? void 0 : _b.reload();
                        }
                    }
                }
            }}/>
            </View>);
    }
}
WepinWebview.defaultProps = {
    config: null,
    visible: false,
};
export default WepinWebview;
//# sourceMappingURL=Webview.js.map
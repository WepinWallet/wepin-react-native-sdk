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
import * as React from 'react';
import { Modal, Platform, StyleSheet, View, Linking, Dimensions } from 'react-native';
import NativeWebView from 'react-native-webview';
import LOG from '../utils/log';
import { getEventListener } from './event/eventListener';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import Utils from '../utils/utils';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import URLParser from 'url';
export class WebView extends React.Component {
    static get Wepin() {
        return this._wepin;
    }
    constructor(props) {
        super(props);
        this._open = (config) => __awaiter(this, void 0, void 0, function* () {
            LOG.debug('====================wepin open: config url', config.url);
            LOG.debug('====================wepin open: this.state.visible', this.state.visible);
            if (this.state.visible) {
                yield new Promise(resolve => this.setState(prevState => (Object.assign(Object.assign({}, prevState), { config })), resolve));
                return;
            }
            yield new Promise(resolve => this.setState(prevState => (Object.assign(Object.assign({}, prevState), { visible: true, config })), () => {
                LOG.debug('reload???', this.state.config);
                resolve();
            }));
        });
        this._close = () => __awaiter(this, void 0, void 0, function* () {
            var _b, _c;
            if (!this.state.visible) {
                return;
            }
            LOG.debug('clesrHistory');
            if (Platform.OS === 'android' && ((_b = this.webRef) === null || _b === void 0 ? void 0 : _b.clearHistory)) {
                LOG.debug('clesrHistory');
                (_c = this.webRef) === null || _c === void 0 ? void 0 : _c.clearHistory();
            }
            const config = Object.assign(Object.assign({}, this.state.config), { url: '' });
            yield new Promise(resolve => this.setState(prevState => (Object.assign(Object.assign({}, prevState), { config, visible: false })), resolve));
        });
        this._handleSetRef = (_ref) => {
            this.webRef = _ref;
        };
        this.response = (message) => {
            var _b;
            LOG.debug('response', message);
            (_b = this.webRef) === null || _b === void 0 ? void 0 : _b.postMessage(JSON.stringify(message));
        };
        this.request = (message) => {
            var _b;
            LOG.debug('request', message);
            (_b = this.webRef) === null || _b === void 0 ? void 0 : _b.postMessage(JSON.stringify(message));
        };
        this.handleWebViewLoaded = (e) => {
            var _b;
            if ((_b = this.state.config) === null || _b === void 0 ? void 0 : _b.url) {
            }
        };
        this._WebivewRender = () => {
            if (!this.state.config) {
                return <></>;
            }
            const { styles, config: { url, appInfo }, } = this.state;
            return (<View style={appInfo.attributes.type === 'show' ? styles.webviewContainer : { height: 0 }}>
        <NativeWebView ref={this._handleSetRef} source={{ uri: url }} style={appInfo.attributes.type === 'show' ? styles.webview : { height: 0 }} javaScriptEnabled={true} domStorageEnabled={true} thirdPartyCookiesEnabled={true} cacheEnabled={true} androidLayerType={'hardware'} onError={({ nativeEvent }) => LOG.error('Webview error: ', nativeEvent)} onLoad={this.handleWebViewLoaded} onMessage={this.EL} onOpenWindow={(eventData) => {
                    var _b;
                    const inAppUrl = (_b = eventData === null || eventData === void 0 ? void 0 : eventData.nativeEvent) === null || _b === void 0 ? void 0 : _b.targetUrl;
                    LOG.debug('onOpenWindow Url : ', inAppUrl);
                    this.openUrl(inAppUrl);
                }} onNavigationStateChange={webviewState => {
                    var _b, _c;
                    if ((_b = this.state.config) === null || _b === void 0 ? void 0 : _b.url) {
                        if (this.state.config.url.includes('wepin-sdk-login') && this.state.config.appInfo.attributes.type !== 'show') {
                            LOG.debug('webviewState.url', webviewState.url);
                            if (webviewState.url !== this.state.config.url) {
                                LOG.debug('reload!!!');
                                (_c = this.webRef) === null || _c === void 0 ? void 0 : _c.reload();
                            }
                        }
                    }
                }}/>
      </View>);
        };
        this.render = () => {
            const { visible, styles, config } = this.state;
            const { _WebivewRender } = this;
            return (<Modal transparent={true} visible={visible}>
        <View style={(config === null || config === void 0 ? void 0 : config.appInfo.attributes.type) === 'show' ? styles.backgroundContainer : { height: 0 }}/>
        <_WebivewRender />
      </Modal>);
        };
        this.EL = getEventListener(this);
        this.state = {
            styles: __styles(),
            visible: false,
        };
    }
    openUrl(url) {
        var _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAvailable = yield InAppBrowser.isAvailable();
                if (isAvailable) {
                    LOG.debug('Open Url InAppBrowser');
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
                                const pathName = (_b = urlObj.pathname) === null || _b === void 0 ? void 0 : _b.split('/');
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
}
_a = WebView;
WebView.instance = React.createRef();
WebView.show = (args) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    _a._wepin = args.wepin;
    yield ((_b = WebView.instance.current) === null || _b === void 0 ? void 0 : _b._open(args));
    return WebView.instance.current;
});
WebView.hide = () => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    yield ((_c = WebView.instance.current) === null || _c === void 0 ? void 0 : _c._close());
});
const __styles = () => StyleSheet.create({
    backgroundContainer: Object.assign(Object.assign({}, StyleSheet.absoluteFillObject), { backgroundColor: 'rgba(0,0,0,0.7)' }),
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
//# sourceMappingURL=Webview.js.map
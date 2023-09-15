import { Platform } from 'react-native';
import LOG from '../../utils/log';
import { WebView } from '../Webview';
export const WebviewRequestHandler = (message, widget) => {
    var _a, _b, _c;
    const response = {
        header: {
            response_from: 'react-native',
            response_to: 'wepin_widget',
            id: message.header.id,
        },
    };
    switch (message.body.command) {
        case 'ready_to_widget':
            LOG.debug('web request: message.bod ', message.body);
            response.body = {
                command: 'ready_to_widget',
                state: 'SUCCESS',
                data: {
                    appKey: WebView.Wepin.wepinAppKey,
                    domain: WebView.Wepin.wepinDomain,
                    platform: Platform.OS === 'ios' ? 3 : 2,
                    attributes: WebView.Wepin.wepinAppAttributes,
                    version: WebView.Wepin.version.includes('-alpha')
                        ? WebView.Wepin.version.substring(0, WebView.Wepin.version.indexOf('-'))
                        : WebView.Wepin.version,
                },
            };
            break;
        case 'initialized_widget':
            LOG.debug('initialized_widget result =>', (_a = message.body.parameter) === null || _a === void 0 ? void 0 : _a.result);
            WebView.Wepin._isInitialized = (_b = message.body.parameter) === null || _b === void 0 ? void 0 : _b.result;
            response.body = {
                command: 'initialized_widget',
                state: 'SUCCESS',
                data: '',
            };
            WebView.Wepin.emit('widgetOpened');
            break;
        case 'set_accounts':
            LOG.debug('set_accounts result =>', message.body.parameter);
            WebView.Wepin.setAccountInfo((_c = message.body.parameter) === null || _c === void 0 ? void 0 : _c.accounts);
            response.body = {
                command: 'set_accounts',
                state: 'SUCCESS',
                data: '',
            };
            break;
        case 'close_wepin_widget':
            WebView.hide();
            break;
        case 'dequeue_request':
            if (WebView.Wepin.queue[0]) {
                windowCloseObserver();
                response.body = {
                    command: message.body.command,
                    state: 'SUCCESS',
                    data: WebView.Wepin.queue[0],
                };
            }
            else {
                response.body = {
                    command: message.body.command,
                    state: 'ERROR',
                    data: null,
                };
            }
            break;
        case 'set_user_info':
            LOG.debug('set_user_info ', message.body);
            WebView.Wepin.setUserInfo(message.body.parameter);
            response.body = {
                command: 'set_user_info',
                state: 'SUCCESS',
                data: '',
            };
            break;
        case 'wepin_logout':
            LOG.debug('wepin_logout');
            WebView.Wepin.emit('onLogout', message.body.parameter);
            response.body = {
                command: 'wepin_logout',
                state: 'SUCCESS',
                data: '',
            };
            break;
        default:
            throw new Error(`Command ${message.body.command} is not supported.`);
    }
    if (widget.state.visible) {
        widget.response(response);
    }
    function windowCloseObserver() {
    }
};
//# sourceMappingURL=requestHandler.js.map
import { Platform } from 'react-native';
import LOG from '../../utils/log';
import { closeWidgetAndClearWebview } from '../../utils/commmonWidget';
export const WebviewRequestHandler = (message, widget) => {
    var _a, _b, _c, _d;
    const response = {
        header: {
            response_from: 'react-native',
            response_to: 'wepin_widget',
            id: message.header.id,
        },
    };
    const wepin = widget.props.config.wepin;
    switch (message.body.command) {
        case 'ready_to_widget':
            LOG.debug('web request: message.bod ', message.body);
            LOG.debug('init?', wepin.wepinAppKey);
            response.body = {
                command: 'ready_to_widget',
                state: 'SUCCESS',
                data: {
                    appKey: wepin.wepinAppKey,
                    domain: wepin.wepinDomain,
                    platform: Platform.OS === 'ios' ? 3 : 2,
                    attributes: wepin.wepinAppAttributes,
                    version: wepin.version.includes('-alpaha')
                        ? wepin.version.substring(0, wepin.version.indexOf('-'))
                        : wepin.version
                },
            };
            wepin.emit('startAdminRequest');
            break;
        case 'initialized_widget':
            LOG.debug('initialized_widget result =>', (_a = message.body.parameter) === null || _a === void 0 ? void 0 : _a.result);
            wepin._isInitialized = (_b = message.body.parameter) === null || _b === void 0 ? void 0 : _b.result;
            response.body = {
                command: 'initialized_widget',
                state: 'SUCCESS',
                data: '',
            };
            wepin.emit('widgetOpened');
            break;
        case 'set_accounts':
            LOG.debug('set_accounts result =>', message.body.parameter);
            wepin.setAccountInfo((_c = message.body.parameter) === null || _c === void 0 ? void 0 : _c.accounts, (_d = message.body.parameter) === null || _d === void 0 ? void 0 : _d.detailAccount);
            response.body = {
                command: 'set_accounts',
                state: 'SUCCESS',
                data: '',
            };
            break;
        case 'close_wepin_widget':
            LOG.debug('close??');
            LOG.debug('close_widget...., wepin', widget.props.config);
            closeWidgetAndClearWebview(wepin, widget);
            break;
        case 'dequeue_request':
            if (wepin.queue && wepin.queue[0]) {
                windowCloseObserver();
                response.body = {
                    command: message.body.command,
                    state: 'SUCCESS',
                    data: wepin.queue[0]
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
            wepin.setUserInfo(message.body.parameter);
            response.body = {
                command: 'set_user_info',
                state: 'SUCCESS',
                data: '',
            };
            break;
        case 'wepin_logout':
            LOG.debug('wepin_logout');
            wepin.emit('onLogout', message.body.parameter);
            response.body = {
                command: 'wepin_logout',
                state: 'SUCCESS',
                data: '',
            };
            break;
        case 'set_user_email':
            response.body = {
                command: 'set_user_email',
                state: 'SUCCESS',
                data: {
                    email: widget.props.config.specifiedEmail,
                },
            };
            break;
        default:
            throw new Error(`Command ${message.body.command} is not supported.`);
    }
    LOG.debug('widget.state: ', widget.state);
    LOG.debug('widget.props: ', widget.props);
    if (widget.props.visible) {
        widget.response(response);
    }
    function windowCloseObserver() {
    }
};
//# sourceMappingURL=requestHandler.js.map
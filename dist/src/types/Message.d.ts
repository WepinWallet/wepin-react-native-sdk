type WepinCommand = 'ready_to_widget' | 'initialized_widget' | 'set_accounts' | 'close_wepin_widget' | 'provider_request' | 'dequeue_request' | 'set_token' | 'set_user_info' | 'wepin_logout' | 'request_enable' | 'sign_transaction' | 'send_transaction' | 'sign_typed_data' | 'sign' | 'wallet_switchEthereumChain' | 'signup_email' | 'login_email' | 'register_wepin' | 'get_balance' | 'set_user_email';
export interface WebviewReqestMessage {
    header: {
        request_from: 'wepin_widget';
        request_to: 'react-native';
        id: number;
    };
    body: {
        command: WepinCommand;
        parameter: any;
    };
}
export interface WebviewResponseMessage {
    header: {
        response_from: 'wepin_widget';
        response_to: 'react-native';
        id: number;
    };
    body: {
        command: WepinCommand;
        state: 'ERROR' | 'SUCCESS';
        data: any;
    };
}
export interface WepinRequestMessage {
    header: {
        request_from: 'react-native';
        request_to: 'wepin_widget';
        id: number;
    };
    body: {
        command: WepinCommand;
        parameter: any;
    };
}
export interface WepinResponseMessage {
    header: {
        response_from: 'react-native';
        response_to: 'wepin_widget';
        id: number;
    };
    body: {
        command: WepinCommand;
        state: 'ERROR' | 'SUCCESS';
        data: any;
    };
}
export {};

import { WebviewReqestMessage } from '../../types/Message';
import WepinWebview from '../Webview';
export declare const WebviewRequestHandler: (message: WebviewReqestMessage, widget: WepinWebview) => Promise<void> | undefined;

import { WebViewMessageEvent } from 'react-native-webview';
import { WebView } from '../Webview';
export declare const getEventListener: (widget: WebView) => (event: WebViewMessageEvent) => void;

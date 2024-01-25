import * as React from 'react';
import { ReactElement } from 'react';
import { IConfigWebview } from './Webview';
type IProps = {
    webviewConfig?: Pick<IConfigWebview, 'wepin'>;
    children: ReactElement | ReactElement[];
};
export declare const WepinWidget: React.FunctionComponent<IProps>;
export {};

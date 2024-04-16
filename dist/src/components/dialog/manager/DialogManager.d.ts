import RootSiblings from 'react-native-root-siblings';
import { IAttributes } from '@wepin/types';
import { Wepin } from '../../../wepin';
export type IConfigWebview = {
    url: string;
    appInfo: {
        appKey: string;
        appId: string;
        attributes: IAttributes;
        domain: string;
        platform: string;
        version?: string;
    };
    specifiedEmail?: string;
    wepin: Wepin;
};
export type DialogManagerProps = {
    visible?: boolean;
    height?: number;
    hasOverlay?: boolean;
    overlayPointerEvents?: 'auto' | 'none';
    onTouchOutside?: () => void;
    onDismiss?: () => void;
    webviewConfig?: IConfigWebview;
};
type DialogArray = {
    sibling: RootSiblings;
    props: DialogManagerProps;
}[];
declare class DialogManager {
    dialogs: DialogArray;
    constructor();
    get currentDialog(): {
        sibling: RootSiblings;
        props: DialogManagerProps;
    };
    add(props: any, callback: () => void): void;
    destroy(): Promise<void>;
    onDialogDismissed: (onDismissed?: Function) => void;
    update: (props: any, callback?: (() => void) | undefined) => void;
    show: (props: DialogManagerProps, callback?: () => void) => void;
    dismiss: (callback?: (() => void) | undefined) => void;
    dismissAll: (callback?: (() => void) | undefined) => void;
}
export default DialogManager;

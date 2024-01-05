import React from 'react';
import RootSiblings from 'react-native-root-siblings';
import DialogComponent from '../DialogComponent';
import LOG from '../../../utils/log';
const DESTROY_TIMEOUT = 500;
class DialogManager {
    constructor() {
        this.onDialogDismissed = (onDismissed) => {
            if (onDismissed)
                onDismissed();
            this.destroy();
        };
        this.update = (props, callback) => {
            var _a;
            if (props.webviewConfig) {
                this.currentDialog.props.webviewConfig = props.webviewConfig;
            }
            (_a = this.currentDialog.sibling) === null || _a === void 0 ? void 0 : _a.update(<DialogComponent {...this.currentDialog.props} {...props} onDismissed={() => { this.onDialogDismissed(props.onDismissed); }}/>, callback);
        };
        this.show = (props, callback) => {
            this.add(Object.assign(Object.assign({}, props), { visible: true }), callback !== null && callback !== void 0 ? callback : (() => { }));
        };
        this.dismiss = (callback) => {
            LOG.debug('dialogManger Dismiss-----');
            this.update({
                visible: false,
            }, callback);
        };
        this.dismissAll = (callback) => {
            this.dialogs.forEach(() => {
                this.dismiss(callback);
            });
        };
        this.dialogs = [];
    }
    get currentDialog() {
        return this.dialogs[this.dialogs.length - 1];
    }
    add(props, callback) {
        const dialog = new RootSiblings(<DialogComponent {...props} onDismiss={() => { this.onDialogDismissed(props.onDismiss); }}/>, callback);
        this.dialogs.push({ sibling: dialog, props });
    }
    destroy() {
        LOG.debug('before destroy dialog ');
        const dialog = this.dialogs.pop();
        LOG.debug('after destroy: ', this.dialogs);
        return new Promise(((resolve) => {
            setTimeout(() => {
                var _a;
                (_a = dialog === null || dialog === void 0 ? void 0 : dialog.sibling) === null || _a === void 0 ? void 0 : _a.destroy();
                resolve();
            }, DESTROY_TIMEOUT);
        }));
    }
}
export default DialogManager;
//# sourceMappingURL=DialogManager.js.map
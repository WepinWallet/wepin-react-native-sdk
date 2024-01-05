import DialogManager from "../components/dialog";
export const closeWidgetAndClearWebview = (wepin, webview) => {
    if (webview) {
        wepin.removeAllListeners('startAdminRequest');
        webview.EL = () => { };
        wepin.setWidgetWebview(undefined);
    }
    if (DialogManager.currentDialog) {
        DialogManager.dismiss();
        DialogManager.destroy();
    }
};
//# sourceMappingURL=commmonWidget.js.map
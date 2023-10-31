export default DialogManager;
declare class DialogManager {
    dialogs: any[];
    get currentDialog(): any;
    add(props: any, callback: any): void;
    destroy(): void;
    onDialogDismissed: (onDismissed?: Function) => void;
    update: (props: Object, callback?: Function) => void;
    show: (props: Object, callback?: Function) => void;
    dismiss: (callback?: Function) => void;
    dismissAll: (callback?: Function) => void;
}

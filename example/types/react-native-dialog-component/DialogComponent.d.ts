export default DialogComponent;
declare class DialogComponent {
    static defaultProps: {
        animationDuration: number;
        width: number;
        height: number;
    };
    constructor(props: DialogType);
    props: DialogType;
    show(onShown: any): void;
    dismiss(onDismissed: any): void;
    render(): any;
    popupDialog: any;
}

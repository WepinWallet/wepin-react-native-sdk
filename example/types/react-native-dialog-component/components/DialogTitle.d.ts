export default DialogTitle;
declare function DialogTitle({ title, titleStyle, titleTextStyle, titleAlign, haveTitleBar, }: PopupDialogTitleType): any;
declare namespace DialogTitle {
    namespace defaultProps {
        let titleAlign: string;
        let haveTitleBar: boolean;
    }
}

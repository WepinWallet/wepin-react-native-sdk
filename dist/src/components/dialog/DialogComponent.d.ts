import React, { Component } from 'react';
import type { DialogProps } from './Dialog';
declare class DialogComponent extends Component {
    props: DialogProps;
    static defaultProps: {
        animationDuration: number;
        width: number;
        height: number | null | undefined;
    };
    popupDialog: any;
    constructor(props: DialogProps);
    show(onShown: any): void;
    dismiss(onDismissed: any): void;
    render(): React.JSX.Element;
}
export default DialogComponent;

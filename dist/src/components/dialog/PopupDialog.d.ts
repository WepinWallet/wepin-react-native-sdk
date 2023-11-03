import React, { Component } from 'react';
import Sibling from 'react-native-root-siblings';
import type { DialogProps } from './Dialog';
type State = {
    visible: boolean;
};
export default class PopupDialog extends Component<DialogProps, State> {
    constructor(props: DialogProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: DialogProps, prevState: State): void;
    handleDismiss: () => void;
    sibling: Sibling | null;
    createDialog(): void;
    updateDialog(): void;
    destroyDialog(): void;
    renderDialog(): React.JSX.Element;
    render(): null;
}
export {};

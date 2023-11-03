import React, { Component } from 'react';
import { Animated } from 'react-native';
export type OverlayProps = {
    visible: boolean;
    opacity: number;
    onPress?: () => void;
    backgroundColor?: string;
    animationDuration?: number;
    pointerEvents?: Animated.AnimatedValue | Animated.AnimatedInterpolation<string | number> | "box-none" | "none" | "box-only" | "auto" | undefined;
    useNativeDriver?: boolean;
};
declare class Overlay extends Component<OverlayProps> {
    static defaultProps: {
        backgroundColor: string;
        opacity: number;
        animationDuration: number;
        visible: boolean;
        useNativeDriver: boolean;
        onPress: () => void;
    };
    componentDidUpdate(prevProps: OverlayProps): void;
    opacity: Animated.Value;
    render(): React.JSX.Element;
}
export default Overlay;

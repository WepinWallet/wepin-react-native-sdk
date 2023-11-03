import { Animated } from 'react-native';
export default class FadeAnimation {
    useNativeDriver: boolean;
    animate: Animated.Value | Animated.ValueXY;
    animations: Object;
    animationDuration: number;
    constructor({ toValue, animationDuration, useNativeDriver, }?: {
        toValue?: number | undefined;
        animationDuration?: number | undefined;
        useNativeDriver?: boolean | undefined;
    });
    toValue(toValue: number, onFinished?: Animated.EndCallback | undefined): void;
    createAnimations(): Object;
}

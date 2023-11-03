import { Animated } from 'react-native';
export default class FadeAnimation {
    constructor({ toValue = 0, animationDuration = 200, useNativeDriver = true, } = {}) {
        this.useNativeDriver = useNativeDriver;
        this.animate = new Animated.Value(toValue);
        this.animations = this.createAnimations();
        this.animationDuration = animationDuration;
    }
    toValue(toValue, onFinished) {
        Animated.timing(this.animate, {
            toValue,
            duration: this.animationDuration,
            useNativeDriver: this.useNativeDriver,
        }).start(onFinished !== null && onFinished !== void 0 ? onFinished : (() => { }));
    }
    createAnimations() {
        return { opacity: this.animate };
    }
}
//# sourceMappingURL=FadeAnimations.js.map
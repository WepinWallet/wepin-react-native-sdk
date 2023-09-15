import EventEmitter from 'eventemitter3';
function safeApply(handler, context, args) {
    try {
        Reflect.apply(handler, context, args);
    }
    catch (err) {
        setTimeout(() => {
            throw err;
        });
    }
}
function arrayClone(arr) {
    const n = arr.length;
    const copy = new Array(n);
    for (let i = 0; i < n; i += 1) {
        copy[i] = arr[i];
    }
    return copy;
}
export default class SafeEventEmitter extends EventEmitter {
    emit(event, ...args) {
        let doError = event === 'error';
        const events = this._events;
        if (events !== undefined) {
            doError = doError && events.error === undefined;
        }
        else if (!doError) {
            return false;
        }
        if (doError) {
            let er;
            if (args.length > 0) {
                ;
                [er] = args;
            }
            if (er instanceof Error) {
                throw er;
            }
            const err = new Error(`Unhandled error.${er ? ` (${er.message})` : ''}`);
            err.context = er;
            throw err;
        }
        const handler = events[event];
        if (handler === undefined) {
            return false;
        }
        if (typeof handler === 'function') {
            safeApply(handler, this, args);
        }
        else {
            const len = handler.length;
            const listeners = arrayClone(handler);
            for (let i = 0; i < len; i += 1) {
                safeApply(listeners[i], this, args);
            }
        }
        return true;
    }
}
//# sourceMappingURL=safeEventEmitter.js.map
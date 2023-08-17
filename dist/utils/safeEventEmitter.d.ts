import EventEmitter from 'eventemitter3';
export default class SafeEventEmitter extends EventEmitter {
    emit<T extends string | symbol>(event: T, ...args: any[]): boolean;
}

import { WepinRequestMessage } from '../../types/Message';
import { CreateWepinMiddlewareOptions } from '../../types/Provider';
export declare const makeRequestID: () => number;
export declare const requestFactory: ({ wepin, network, req, res, next, end, command, parameter, }: {
    wepin: CreateWepinMiddlewareOptions['wepin'];
    network: CreateWepinMiddlewareOptions['network'];
    req: any;
    res: any;
    next: any;
    end: any;
    command: WepinRequestMessage['body']['command'];
    parameter: any;
}) => void;

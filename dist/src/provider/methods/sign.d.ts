import { UnvalidatedJsonRpcRequest } from '../types/EIP1193';
import { CreateWepinMiddlewareOptions } from '@/types/Provider';
export declare const sign: ({ wepin, network, isPersonal, }: CreateWepinMiddlewareOptions & {
    isPersonal: boolean;
}) => (req: UnvalidatedJsonRpcRequest, res: any, next: any, end: any) => void;

import { UnvalidatedJsonRpcRequest } from '../types/EIP1193';
import { CreateWepinMiddlewareOptions } from '@/types/Provider';
export declare const requestAccounts: ({ wepin, network }: CreateWepinMiddlewareOptions) => (req: UnvalidatedJsonRpcRequest, res: any, next: any, end: any) => void;

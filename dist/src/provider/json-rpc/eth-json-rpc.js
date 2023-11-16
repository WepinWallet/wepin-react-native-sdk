var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createAsyncMiddleware } from 'json-rpc-engine';
import { ethErrors } from 'eth-rpc-errors';
import base64 from 'react-native-base64';
import { URL } from 'react-native-url-polyfill';
import axios from 'axios';
import LOG from '../../utils/log';
const btoa = base64.encode;
const RETRIABLE_ERRORS = [
    'Gateway timeout',
    'ETIMEDOUT',
    'failed to parse response body',
    'Failed to fetch',
];
export function createFetchMiddlewareEther({ rpcUrl, originHttpHeaderKey, }) {
    return createAsyncMiddleware((req, res, _next) => __awaiter(this, void 0, void 0, function* () {
        const { fetchUrl, fetchParams } = createFetchConfigFromReq({
            req,
            rpcUrl,
            originHttpHeaderKey,
        });
        const maxAttempts = 5;
        const retryInterval = 1000;
        let isRetriable = true;
        try {
            const fetchRes = yield axios(fetchParams);
            checkForHttpErrors(fetchRes);
            const rawBody = fetchRes.data;
            const result = parseResponse(fetchRes, rawBody);
            res.result = result;
            return;
        }
        catch (err) {
            LOG.debug('fetch error:, ', err);
            res.error = err;
            _next();
            return;
            const errMsg = err === null || err === void 0 ? void 0 : err.toString();
            LOG.debug('fetch errMsg:, ', errMsg);
            isRetriable = RETRIABLE_ERRORS.some((phrase) => {
                const errRes = errMsg === null || errMsg === void 0 ? void 0 : errMsg.includes(phrase);
                return errRes;
            });
            LOG.debug('fetch isRetriable:, ', isRetriable);
            if (!isRetriable) {
                res.error = err;
                _next();
                return;
            }
        }
    }));
}
function checkForHttpErrors(fetchRes) {
    switch (fetchRes.status) {
        case 405:
            throw ethErrors.rpc.methodNotFound();
        case 418:
            throw createRatelimitError();
        case 503:
        case 504:
            throw createTimeoutError();
        default:
            break;
    }
}
function parseResponse(fetchRes, body) {
    if (fetchRes.status !== 200) {
        throw ethErrors.rpc.internal({
            message: `Non-200 status code: '${fetchRes.status}'`,
            data: body,
        });
    }
    if (body.error) {
        throw ethErrors.rpc.internal({
            data: body.error,
        });
    }
    return body.result;
}
function createFetchConfigFromReq({ req, rpcUrl, originHttpHeaderKey, }) {
    const parsedUrl = new URL(rpcUrl);
    const fetchUrl = normalizeUrlFromParsed(parsedUrl);
    const payload = {
        id: req.id,
        jsonrpc: req.jsonrpc,
        method: req.method,
        params: req.params,
    };
    const originDomain = req.origin;
    const fetchParams = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        url: fetchUrl,
        data: payload
    };
    if (parsedUrl.username && parsedUrl.password) {
        const authString = `${parsedUrl.username}:${parsedUrl.password}`;
        const encodedAuth = btoa(authString);
        fetchParams.headers.Authorization = `Basic ${encodedAuth}`;
    }
    if (originHttpHeaderKey && originDomain) {
        fetchParams.headers[originHttpHeaderKey] = originDomain;
    }
    return { fetchUrl, fetchParams };
}
function normalizeUrlFromParsed(parsedUrl) {
    let result = '';
    result += parsedUrl.protocol;
    result += `//${parsedUrl.hostname}`;
    if (parsedUrl.port) {
        result += `:${parsedUrl.port}`;
    }
    result += `${parsedUrl.pathname}`;
    result += `${parsedUrl.search}`;
    return result;
}
function createRatelimitError() {
    return ethErrors.rpc.internal({ message: `Request is being rate limited.` });
}
function createTimeoutError() {
    let msg = `Gateway timeout. The request took too long to process. `;
    msg += `This can happen when querying logs over too wide a block range.`;
    return ethErrors.rpc.internal({ message: msg });
}
function timeout(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}
//# sourceMappingURL=eth-json-rpc.js.map
export const getRpcPromiseCallback = (resolve, reject, unwrapResult = true) => (error, response) => {
    if (error || response.error) {
        reject(error || response.error);
    }
    else {
        !unwrapResult || Array.isArray(response)
            ? resolve(response)
            : resolve(response.result);
    }
};
export const isValidChainId = (chainId) => Boolean(chainId) && typeof chainId === 'string' && chainId.startsWith('0x');
//# sourceMappingURL=utils.js.map
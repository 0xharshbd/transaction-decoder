import { TransactionVerifierSdkError, SDKErrorCode } from '@package/error';
import type { Abi, Hex } from 'viem';

import type { CalldataDecoder } from './calldata-decoder.ts';
import { FunctionHashDecoder } from './function-hash-decoder.ts';

/**
 * A decoder for EVM calldata
 *
 * @example
 * const decoder = new EvmCalldataDecoder([abi]);
 * const [spender, value] = decoder.decode<[Hex, bigint]>(calldata);
 *
 * @example
 * const decoder = new EvmCalldataDecoder();
 * decoder.useAbi([abi]);
 * const [spender, value] = decoder.decode<[Hex, bigint]>(calldata);
 */
export class EvmCalldataDecoder implements CalldataDecoder {
    protected readonly functionDecoders: Map<Hex, FunctionHashDecoder> = new Map();

    constructor(abis: Abi[] = []) {
        for (const abi of abis) {
            this.useAbi(abi);
        }
    }

    /**
     * Get the function decoder for a given hash
     * @param hash - The hash of the function
     * @returns The function decoder
     */
    public getFunctionDecoder(hash: Hex): FunctionHashDecoder {
        const decoder = this.functionDecoders.get(hash);

        if (!decoder) {
            throw new TransactionVerifierSdkError(SDKErrorCode.FUNCTION_DECODER_NOT_FOUND, `Function decoder not found for hash: ${hash}`);
        }

        return decoder;
    }

    /**
     * Add the function decoder to the decoder
     * @param decoder - The function decoder to set
     * @returns The decoder instance
     */
    public setFunctionHashDecoder(decoder: FunctionHashDecoder) {
        if (this.functionDecoders.has(decoder.getFunctionHash())) {
            throw new TransactionVerifierSdkError(
                SDKErrorCode.FUNCTION_DECODER_ALREADY_EXISTS,
                `Function decoder already exists for hash: ${decoder.getFunctionHash()}`,
            );
        }

        this.functionDecoders.set(decoder.getFunctionHash(), decoder);
        return this;
    }

    /**
     * Add the ABI to the decoder
     * @param abi - The ABI to use
     * @returns The decoder instance
     */
    useAbi(abi: Abi) {
        for (let i = 0; i < abi.length; i++) {
            const item = abi[i];
            if (item?.type !== 'function') {
                continue;
            }

            this.setFunctionHashDecoder(new FunctionHashDecoder(item));
        }

        return this;
    }

    /**
     * Get the function hash from the calldata
     * @param calldata - The calldata to get the function hash from
     * @returns The function hash
     */
    getFunctionHash(calldata: Hex): Hex {
        if (calldata.length < 10) {
            throw new TransactionVerifierSdkError(SDKErrorCode.INVALID_CALLDATA, 'Invalid calldata');
        }

        return calldata.slice(0, 10) as Hex;
    }

    /**
     * Decode the calldata
     * @param calldata - The calldata to decode
     * @returns The decoded calldata
     */
    decode<TArgs extends unknown[]>(calldata: Hex): TArgs {
        const functionHash = this.getFunctionHash(calldata);
        const decoder = this.getFunctionDecoder(functionHash);
        return decoder.decode<TArgs>(calldata);
    }
}

import { type AbiFunction, type Hex, toFunctionHash, decodeFunctionData } from 'viem';

import type { CalldataDecoder } from './decoder.ts';

export class FunctionHashDecoder implements CalldataDecoder {
    private readonly abi: AbiFunction;

    /**
     * Create a new FunctionHashDecoder
     * @param options - The options for the FunctionHashDecoder
     */
    constructor(abi: AbiFunction) {
        this.abi = abi;
    }

    /**
     * Get the function hash from the ABI function
     * @returns The function hash
     */
    getFunctionHash(): Hex {
        return toFunctionHash(this.abi).slice(0, 10) as Hex;
    }

    getFunctionName(): string {
        return this.abi.name;
    }

    /**
     * Decode the function data
     * @param calldata - The calldata to decode
     * @returns The decoded function data
     */
    decode<TArgs extends unknown[]>(calldata: Hex): TArgs {
        const result = decodeFunctionData({ abi: [this.abi], data: calldata });
        return result.args as TArgs;
    }
}

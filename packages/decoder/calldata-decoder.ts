import { type Hex } from 'viem';

export interface CalldataDecoder {
    /**
     * Decode the calldata
     * @param calldata - The calldata to decode
     * @returns The decoded calldata
     */
    decode<TArgs extends unknown[]>(calldata: Hex): TArgs | null;
}

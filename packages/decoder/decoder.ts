import { type Hex } from 'viem';

export interface CalldataDecoder {
    decode<TArgs extends unknown[]>(calldata: Hex): TArgs;
}

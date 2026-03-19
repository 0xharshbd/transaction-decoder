import type { Hex } from 'viem';

export interface TransactionLike {
    to: Hex;
    value: bigint;
    data: Hex;
    chainId: Hex;
}

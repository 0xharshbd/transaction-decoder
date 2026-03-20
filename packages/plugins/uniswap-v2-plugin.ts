import type { Abi, Address, Hex } from 'viem';

import { TransactionAction, type TransactionCalldataNormalizer } from '@package/types';

const ZERO: Hex = '0x0000000000000000000000000000000000000000';

import { SDKErrorCode, TransactionVerifierSdkError } from '@package/error';

import uniswapV2RouterAbi from './abi/uniswap_v2_router.abi.json' with { type: 'json' };
import { EvmPlugin } from './evm-transaction-verifier-plugin.ts';

interface UniswapV2Contact {
    swapTokensForExactETH: [amountOutMin: bigint, path: [Address, Address], to: Hex, deadline: bigint];
    swapExactTokensForTokens: [amountIn: bigint, amountOutMin: bigint, path: [Address, Address], to: Hex, deadline: bigint];
}

export class UniswapV2Plugin extends EvmPlugin {
    name: string = 'uniswap-v2-plugin';

    getAbis(): Abi[] {
        return [uniswapV2RouterAbi as Abi];
    }

    getActions(): TransactionCalldataNormalizer[] {
        return [
            {
                // https://docs.uniswap.org/contracts/v2/reference/smart-contracts/router-02#swapexacttokensfortokens
                function: '0x38ed1739',
                normalizer: (transaction) => {
                    const data = this.getDecoder().decode<UniswapV2Contact['swapExactTokensForTokens']>(transaction.data);

                    if (!data) {
                        throw new TransactionVerifierSdkError(SDKErrorCode.INVALID_CALLDATA, 'Invalid calldata');
                    }

                    return {
                        action: TransactionAction.SWAP,
                        data: {
                            amountIn: data[0],
                            amountOutMin: data[1],
                            path: [data[2][0], data[2][1]],
                            to: data[3],
                            deadline: data[4] ?? null,
                        },
                    };
                },
            },

            {
                // swapExactEthForTokens - https://docs.uniswap.org/contracts/v2/reference/smart-contracts/router-02#swapexactethfortokens
                function: '0x7ff36ab5',
                normalizer: (transaction) => {
                    const data = this.getDecoder().decode<UniswapV2Contact['swapTokensForExactETH']>(transaction.data);

                    if (!data) {
                        throw new TransactionVerifierSdkError(SDKErrorCode.INVALID_CALLDATA, 'Invalid calldata');
                    }

                    return {
                        action: TransactionAction.SWAP,
                        data: {
                            amountIn: transaction.value,
                            amountOutMin: data[0],
                            path: data[1],
                            to: data[2],
                            deadline: data[3],
                        },
                    };
                },
            },
        ];
    }
}

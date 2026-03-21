import type { Abi, Address, Hex } from 'viem';

import { SDKErrorCode, TransactionVerifierSdkError } from '@package/error';
import { TransactionAction, type TransactionCalldataNormalizer } from '@package/types';

import uniswapV2RouterAbi from './abi/uniswap_v2_router.abi.json' with { type: 'json' };
import { EvmPlugin } from './evm-transaction-verifier-plugin.ts';

interface UniswapV2Contact {
    swapExactTokensForTokens: [amountIn: bigint, amountOutMin: bigint, path: [Address, Address], to: Hex, deadline: bigint];
    swapExactETHForTokens: [amountOutMin: bigint, path: [Address, Address], to: Hex, deadline: bigint];
    swapExactTokensForETH: [amountIn: bigint, amountOutMin: bigint, path: [Address, Address], to: Hex, deadline: bigint];
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
                normalize: (transaction) => {
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
                // swapExactETHForTokens - https://docs.uniswap.org/contracts/v2/reference/smart-contracts/router-02#swapexactethfortokens
                function: '0x7ff36ab5',
                normalize: (transaction) => {
                    const data = this.getDecoder().decode<UniswapV2Contact['swapExactETHForTokens']>(transaction.data);

                    if (!data) {
                        throw new TransactionVerifierSdkError(SDKErrorCode.INVALID_CALLDATA, 'Invalid calldata');
                    }

                    return {
                        action: TransactionAction.SWAP,
                        data: {
                            amountIn: transaction.value,
                            amountOutMin: data[0],
                            path: [data[1][0], data[1][1]],
                            to: data[2],
                            deadline: data[3] ?? null,
                        },
                    };
                },
            },
            {
                // swapExactTokensForETH - https://docs.uniswap.org/contracts/v2/reference/smart-contracts/router-02#swapexacttokensforeth
                function: '0x18cbafe5',
                normalize: (transaction) => {
                    const data = this.getDecoder().decode<UniswapV2Contact['swapExactTokensForETH']>(transaction.data);

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
        ];
    }

    getNormalizerForFunction(functionHash: Hex): TransactionCalldataNormalizer {
        const normalizer = this.getActions().find((action) => action.function === functionHash);
        if (!normalizer) {
            throw new TransactionVerifierSdkError(SDKErrorCode.INVALID_CALLDATA, 'Invalid calldata');
        }
        return normalizer;
    }
}

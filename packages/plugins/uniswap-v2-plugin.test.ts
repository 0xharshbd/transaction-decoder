import { describe, expect, it } from 'bun:test';

import { encodeFunctionData } from 'viem';

import { EvmCalldataDecoder } from '@package/decoder';
import { TransactionAction, type TransactionLike } from '@package/types';

import uniswapV2RouterAbi from './abi/uniswap_v2_router.abi.json' with { type: 'json' };
import { UniswapV2Plugin } from './uniswap-v2-plugin.ts';

const UNISWAP_V2_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const ETHEREUM_CHAIN_ID = '0x1';

describe('UniswapV2Plugin', () => {
    const decoder = new EvmCalldataDecoder();
    const plugin = new UniswapV2Plugin();

    plugin.initializeDecoder(decoder);

    it('should return the actions', () => {
        const actions = plugin.getActions();
        expect(actions).toBeDefined();
        expect(actions).toBeInstanceOf(Array);
    });

    it('should get the name of the plugin', () => {
        expect(plugin.name).toEqual('uniswap-v2-plugin');
    });

    it('should return the abis', () => {
        const abis = plugin.getAbis();
        expect(abis).toBeDefined();
        expect(abis).toBeInstanceOf(Array);
    });

    it('should return the correct action for a swapExactTokensForTokens transaction', () => {
        const amountIn = 1000000000000000000n;
        const amountOutMin = 1000000000000000000n;
        const path = ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', '0x6B175474E89094C44Da98b954EedeAC495271d0F'];
        const to = '0x0000000000000000000000000000000000000000';
        const deadline = 1000000000000000000n;
        const transaction: TransactionLike = {
            to: UNISWAP_V2_ROUTER_ADDRESS,
            chainId: ETHEREUM_CHAIN_ID,
            value: 0n,
            data: encodeFunctionData({
                abi: uniswapV2RouterAbi,
                functionName: 'swapExactTokensForTokens',
                args: [amountIn, amountOutMin, path, to, deadline],
            }),
        };
        const functionHash = decoder.getFunctionHash(transaction.data);
        const normalizer = plugin.getNormalizerForFunction(functionHash);
        const action = normalizer.normalizer(transaction);

        expect(action).toBeDefined();
        expect(action.action).toEqual(TransactionAction.SWAP);
        expect(action.data).toEqual({
            amountIn,
            amountOutMin,
            path,
            to,
            deadline,
        });
    });

    it('should return the correct action for a swapExactETHForTokens transaction', () => {
        const amountOutMin = 1000000000000000000n;
        const path = ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', '0x6B175474E89094C44Da98b954EedeAC495271d0F'];
        const to = '0x0000000000000000000000000000000000000000';
        const deadline = 1000000000000000000n;
        const transaction: TransactionLike = {
            to: UNISWAP_V2_ROUTER_ADDRESS,
            chainId: ETHEREUM_CHAIN_ID,
            value: 1000000000000000000n,
            data: encodeFunctionData({
                abi: uniswapV2RouterAbi,
                functionName: 'swapExactETHForTokens',
                args: [amountOutMin, path, to, deadline],
            }),
        };
        const functionHash = decoder.getFunctionHash(transaction.data);
        const normalizer = plugin.getNormalizerForFunction(functionHash);
        const action = normalizer.normalizer(transaction);

        expect(action).toBeDefined();
        expect(action.action).toEqual(TransactionAction.SWAP);
        expect(action.data).toEqual({
            amountIn: transaction.value,
            amountOutMin,
            path,
            to,
            deadline,
        });
    });

    it('should return the correct action for a swapExactTokensForETH transaction', () => {
        const amountIn = 1000000000000000000n;
        const amountOutMin = 1000000000000000000n;
        const path = ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', '0x6B175474E89094C44Da98b954EedeAC495271d0F'];
        const to = '0x0000000000000000000000000000000000000000';
        const deadline = 1000000000000000000n;
        const transaction: TransactionLike = {
            to: UNISWAP_V2_ROUTER_ADDRESS,
            chainId: ETHEREUM_CHAIN_ID,
            value: 0n,
            data: encodeFunctionData({
                abi: uniswapV2RouterAbi,
                functionName: 'swapExactTokensForETH',
                args: [amountIn, amountOutMin, path, to, deadline],
            }),
        };
        const functionHash = decoder.getFunctionHash(transaction.data);
        const normalizer = plugin.getNormalizerForFunction(functionHash);
        const action = normalizer.normalizer(transaction);

        expect(action).toBeDefined();
        expect(action.action).toEqual(TransactionAction.SWAP);
        expect(action.data).toEqual({
            amountIn,
            amountOutMin,
            path,
            to,
            deadline,
        });
    });
});

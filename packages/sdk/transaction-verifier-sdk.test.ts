import { describe, expect, it } from 'bun:test';

import { z } from 'zod';

import { UniswapV2Plugin } from '@package/plugins/uniswap-v2';
import type { TransactionLike } from '@package/types';
import { CustomTransactionVerifier, ZodTransactionSchemaVerifier } from '@package/verifier';

import { createTransactionVerifierSdk, TransactionVerifierSdk } from './transaction-verifier-sdk.ts';

describe('TransactionVerifierSdk', () => {
    it('should extend the sdk with a plugin', () => {
        const sdk = new TransactionVerifierSdk();
        const plugin = new UniswapV2Plugin();
        sdk.extend(plugin);
        expect(sdk).toBeDefined();
        expect(sdk['actions'].size).toBeGreaterThan(0);
    });

    it('should create the sdk with the plugins', () => {
        const sdk = createTransactionVerifierSdk({
            plugins: [new UniswapV2Plugin()],
        });
        expect(sdk).toBeDefined();
        expect(sdk['actions'].size).toBeGreaterThan(0);
    });

    it('should verify a transaction', async () => {
        const sdk = createTransactionVerifierSdk({
            plugins: [new UniswapV2Plugin()],
        });
        const transaction: TransactionLike = {
            to: '0x1235678901234567890123456789012345678901',
            value: 1000000000000000000n,
            data: '0x',
            chainId: '0x1',
        };

        const { isValid, details } = await sdk.verify(transaction, [
            new ZodTransactionSchemaVerifier({
                to: z.literal(transaction.to),
                value: z.literal(transaction.value),
                data: z.literal(transaction.data),
                chainId: z.literal(transaction.chainId),
            }),

            new CustomTransactionVerifier(async (request) => {
                console.log('Is Transaction Value Zero?', request.getTransaction().value === 0n);
            }),
        ]);

        expect(isValid).toBe(true);
        expect(details).toBeUndefined();
    });
});

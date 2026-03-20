import { describe, expect, it } from 'bun:test';

import { UniswapV2Plugin } from '@package/plugins/uniswap-v2';

import { TransactionVerifierSdk } from './transaction-verifier-sdk.ts';

describe('TransactionVerifierSdk', () => {
    it('should extend the sdk with a plugin', () => {
        const sdk = new TransactionVerifierSdk();
        const plugin = new UniswapV2Plugin();
        sdk.extend(plugin);
        expect(sdk).toBeDefined();
        expect(sdk['actions'].size).toBeGreaterThan(0);
    });
});

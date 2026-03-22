import pkg from './package.json' with { type: 'json' };

const { version } = pkg;

export const SDK_VERSION = `v${version}`;

export { createTransactionVerifierSdk, TransactionVerifierSdk } from './transaction-verifier-sdk.ts';

// Plugins — bundled with the SDK for convenience
export { EvmPlugin } from '@package/plugins/evm-transaction-verifier-plugin';
export { UniswapV2Plugin } from '@package/plugins/uniswap-v2';

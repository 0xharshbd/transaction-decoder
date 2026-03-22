import type { Hex } from 'viem';

import { EvmCalldataDecoder } from '@package/decoder';
import { SDKErrorCode, TransactionVerifierSdkError } from '@package/error';
import { EvmPlugin } from '@package/plugins/evm-transaction-verifier-plugin';
import {
    TransactionAction,
    type TransactionActionData,
    type TransactionCalldataNormalizer,
    type TransactionLike,
    type TransactionVerifierPlugin,
} from '@package/types';
import { TransactionDecodingRequest, VerifierError, type Verifier } from '@package/verifier';

interface SDKOptions {
    plugins: TransactionVerifierPlugin[];
}

export class TransactionVerifierSdk {
    private readonly actions: Map<Hex, TransactionCalldataNormalizer> = new Map();
    private readonly evmDecoder = new EvmCalldataDecoder();

    /**
     * Extend the SDK with a plugin
     * @param plugin - The plugin to extend the SDK with
     */
    public extend(plugin: TransactionVerifierPlugin): void {
        try {
            if (plugin instanceof EvmPlugin) {
                plugin.initializeDecoder(this.evmDecoder);
            }

            for (const action of plugin.getActions()) {
                this.actions.set(action.function, action);
            }
        } catch (error) {
            throw new TransactionVerifierSdkError(SDKErrorCode.PLUGIN_ERROR, 'Failed to extend the SDK with the plugin', {
                plugin: plugin.name,
                cause: error,
            });
        }
    }

    private getTransactionAction(transaction: TransactionLike): TransactionActionData {
        if (transaction.data === '0x') {
            return {
                action: TransactionAction.NATIVE_TRANSFER,
                data: null,
            };
        }

        const functionHash = transaction.data.slice(0, 10) as Hex;
        const action = this.actions.get(functionHash);

        if (!action) {
            throw new TransactionVerifierSdkError(SDKErrorCode.TRANSFORMER_NOT_FOUND, `Transformer not found for function hash: '${functionHash}'`);
        }

        return action.normalize(transaction);
    }

    async verify(transaction: TransactionLike, verifiers: Verifier[]) {
        try {
            const request = new TransactionDecodingRequest({
                transaction,
                action: this.getTransactionAction(transaction),
            });

            for await (const verifier of verifiers) {
                await verifier.verify(request);
            }

            return { isValid: true };
        } catch (error) {
            if (error instanceof VerifierError) {
                return { isValid: false, details: error.details };
            }

            return { isValid: false, details: { error: error } };
        }
    }
}

export const createTransactionVerifierSdk = (options: SDKOptions) => {
    const sdk = new TransactionVerifierSdk();

    for (const plugin of options.plugins) {
        sdk.extend(plugin);
    }

    return sdk;
};

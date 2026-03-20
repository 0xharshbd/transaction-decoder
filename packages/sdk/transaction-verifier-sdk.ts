import type { Hex } from 'viem';

import { SDKErrorCode, TransactionVerifierSdkError } from '@package/error';
import type { TransactionCalldataNormalizer, TransactionVerifierPlugin } from '@package/types';

interface SDKOptions {
    plugins: TransactionVerifierPlugin[];
}

export class TransactionVerifierSdk {
    private readonly actions: Map<Hex, TransactionCalldataNormalizer> = new Map();

    public extend(plugin: TransactionVerifierPlugin): void {
        try {
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
}

export const createTransactionVerifierSdk = (options: SDKOptions) => {
    const sdk = new TransactionVerifierSdk();

    for (const plugin of options.plugins) {
        sdk.extend(plugin);
    }

    return sdk;
};

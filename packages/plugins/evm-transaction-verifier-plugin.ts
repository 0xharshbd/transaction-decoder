import type { Abi, Hex } from 'viem';

import type { EvmCalldataDecoder } from '@package/decoder';
import { SDKErrorCode, TransactionVerifierSdkError } from '@package/error';
import type { TransactionAction, TransactionActionData, TransactionCalldataNormalizer, TransactionVerifierPlugin } from '@package/types';

export abstract class EvmPlugin implements TransactionVerifierPlugin {
    private decoder?: EvmCalldataDecoder;

    abstract getActions(): TransactionCalldataNormalizer[];
    abstract getAbis(): Abi[];

    abstract name: string;

    /**
     * Initialize the decoder for the plugin
     * @param decoder - The decoder to initialize
     */
    initializeDecoder(decoder: EvmCalldataDecoder) {
        this.decoder = decoder;

        for (const abi of this.getAbis()) {
            this.decoder.useAbi(abi);
        }
    }

    /**
     * Get the decoder for the plugin
     * @returns The decoder for the plugin
     */
    getDecoder() {
        if (!this.decoder) {
            throw new TransactionVerifierSdkError(SDKErrorCode.DECODER_NOT_SET, 'Decoder is not initialized in the plugin');
        }

        return this.decoder;
    }
}

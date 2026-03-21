import type { Abi, Hex } from 'viem';

export interface TransactionLike {
    to: Hex;
    value: bigint;
    data: Hex;
    chainId: Hex;
}

export enum TransactionAction {
    NATIVE_TRANSFER = 'native_transfer',
    SWAP = 'swap',
    APPROVAL = 'approval',
    TRANSFER = 'token_transfer',
    UNKNOWN = 'unknown',
}

interface TransactionActionPayloadBox<TAction, TPayload> {
    action: TAction;
    description?: string;
    data: TPayload;
}

export type SwapTransactionAction = TransactionActionPayloadBox<
    TransactionAction.SWAP,
    {
        amountIn: bigint;
        amountOutMin: bigint;
        path: [from: Hex, to: Hex];
        to: Hex;
        deadline: bigint | null;
    }
>;

export type ApprovalTransactionAction = TransactionActionPayloadBox<
    TransactionAction.APPROVAL,
    {
        spender: Hex;
        value: bigint;
    }
>;

export type UnknownTransactionAction = TransactionActionPayloadBox<TransactionAction.UNKNOWN, unknown>;

export type NativeTransferTransactionAction = TransactionActionPayloadBox<TransactionAction.NATIVE_TRANSFER, null>;

export type TransactionActionData = SwapTransactionAction | ApprovalTransactionAction | NativeTransferTransactionAction | UnknownTransactionAction;

export interface TransactionCalldataNormalizer {
    function: Hex;
    normalize(transaction: TransactionLike): TransactionActionData;
}

export interface TransactionVerifierPlugin {
    name: string;
    /**
     * Get the action for the given calldata.
     * @param calldata - The calldata to get the action for
     * @returns The action for the given calldata
     */
    getActions(): TransactionCalldataNormalizer[];
}

export interface EvmTransactionVerifierPlugin extends TransactionVerifierPlugin {
    /**
     * Get the ABIs for the plugin.
     * @returns The ABIs for the plugin
     */
    getABIs(): Abi[];
}

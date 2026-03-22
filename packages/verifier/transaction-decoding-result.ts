import type { TransactionActionData, TransactionLike } from '@package/types';

/**
 * The context for the TransactionDecodingResult
 */
export interface TransactionDecodingResultContext {
    [key: string]: unknown;
}

/**
 * The parameters for the TransactionDecodingResult constructor
 */
export interface TransactionDecodingResultConstructorParams {
    transaction: TransactionLike;
    action?: TransactionActionData;
    context?: TransactionDecodingResultContext;
}

/**
 * The result of the transaction decoding
 */
export class TransactionDecodingRequest {
    private readonly transaction: TransactionLike;

    private action: TransactionActionData | undefined;

    private context: TransactionDecodingResultContext = {};

    constructor({ transaction, action, context }: TransactionDecodingResultConstructorParams) {
        this.transaction = transaction;
        this.action = action;
        this.context = context ?? {};
    }

    getTransaction(): Readonly<TransactionLike> {
        return this.transaction;
    }

    setAction(action: TransactionActionData) {
        this.action = action;
    }

    getAction(): Readonly<TransactionActionData> | null {
        return this.action ?? null;
    }

    getContext<TValue>(key: string): TValue | undefined {
        return this.context[key] as TValue | undefined;
    }

    setContext<TValue>(key: string, value: TValue) {
        this.context[key] = value;
    }
}

import { z, type ZodObject, type ZodType } from 'zod';

import { SDKErrorCode, TransactionVerifierSdkError } from '@package/error';

import type { TransactionDecodingRequest } from './transaction-decoding-result';

export interface VerifierResult {
    isValid: boolean;
    context: Record<string, unknown>;
}

export interface Verifier {
    verify(result: TransactionDecodingRequest): Promise<void>;
}

export class VerifierError extends Error {
    public readonly details: Record<string, unknown>;

    constructor(message: string, details?: Record<string, unknown> & ErrorOptions) {
        const { cause, ...rest } = details ?? {};
        super(message, { cause });
        this.name = 'VerifierError';
        this.details = rest;
    }
}

export interface ZodTransactionSchemaVerifierSchema {
    to: ZodType;
    value: ZodType;
    data: ZodType;
    chainId: ZodType;
}

export class ZodTransactionSchemaVerifier implements Verifier {
    private readonly schema: ZodObject;

    constructor(schema: Readonly<ZodTransactionSchemaVerifierSchema>) {
        this.schema = z.object(schema);
    }

    async verify(request: TransactionDecodingRequest) {
        const parsed = await this.schema.safeParseAsync(request.getTransaction());
        if (parsed.success) {
            return;
        }

        throw new VerifierError('Transaction does not match the with the provided zod schema');
    }
}

export interface ZodTransactionCalldataVerifierSchema {
    function: ZodType;
    args: ZodType;
}

export class ZodTransactionCalldataVerifier implements Verifier {
    private readonly schema: ZodType;

    constructor(schema: ZodType) {
        this.schema = schema;
    }

    async verify(request: TransactionDecodingRequest) {
        const action = request.getAction();

        if (action == null) {
            throw new VerifierError('Transaction has no action');
        }

        const parsed = await this.schema.safeParseAsync(request.getAction());
        if (parsed.success) {
            return;
        }

        throw new VerifierError('Transaction calldata does not match the with the provided zod schema');
    }
}

export class CustomTransactionVerifier implements Verifier {
    private readonly callback: (request: TransactionDecodingRequest) => Promise<void>;

    constructor(callback: (request: TransactionDecodingRequest) => Promise<void>) {
        this.callback = callback;
    }

    async verify(request: TransactionDecodingRequest) {
        try {
            await this.callback(request);
        } catch (error) {
            if (error instanceof VerifierError) {
                throw error;
            }

            throw new TransactionVerifierSdkError(SDKErrorCode.VERIFIER_ERROR, 'Unexpected error while verifying the transaction');
        }
    }
}

/**
 * Create a valid verifier result
 * @param context - The context to set in the verifier result
 * @returns The valid verifier result
 */
export const createValidVerifierResult = (context?: Record<string, unknown>): VerifierResult => {
    return { isValid: true, context: context ?? {} };
};

/**
 * Create an invalid verifier result
 * @param context - The context to set in the verifier result
 * @returns The invalid verifier result
 */
export const createInvalidVerifierResult = (context: Record<string, unknown>): VerifierResult => {
    return { isValid: false, context };
};

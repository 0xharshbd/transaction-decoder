export enum SDKErrorCode {
    FUNCTION_DECODER_NOT_FOUND = 'FUNCTION_DECODER_NOT_FOUND',
    FUNCTION_DECODER_ALREADY_EXISTS = 'FUNCTION_DECODER_ALREADY_EXISTS',
    INVALID_CALLDATA = 'INVALID_CALLDATA',
}

/**
 * An error thrown by the Transaction Verifier SDK
 */
export class TransactionVerifierSdkError extends Error {
    public readonly code: SDKErrorCode;

    public readonly details?: Record<string, unknown>;

    constructor(code: SDKErrorCode, message: string, details?: Record<string, unknown>) {
        super(message);

        this.name = 'TransactionVerifierSdkError';
        this.code = code;
        this.details = details;
    }
}

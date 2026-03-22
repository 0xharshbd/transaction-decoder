export enum SDKErrorCode {
    FUNCTION_DECODER_NOT_FOUND = 'FUNCTION_DECODER_NOT_FOUND',
    FUNCTION_DECODER_ALREADY_EXISTS = 'FUNCTION_DECODER_ALREADY_EXISTS',
    INVALID_CALLDATA = 'INVALID_CALLDATA',
    DECODER_NOT_SET = 'DECODER_NOT_SET',
    PLUGIN_ERROR = 'PLUGIN_ERROR',
    TRANSFORMER_NOT_FOUND = 'TRANSFORMER_NOT_FOUND',
    VERIFIER_ERROR = 'VERIFIER_ERROR',
}

/**
 * An error thrown by the Transaction Verifier SDK
 */
export class TransactionVerifierSdkError extends Error {
    public readonly code: SDKErrorCode;

    public readonly details?: Record<string, unknown>;

    constructor(code: SDKErrorCode, message: string, details?: Record<string, unknown> & ErrorOptions) {
        super(message);

        this.name = 'TransactionVerifierSdkError';
        this.code = code;
        this.details = details;
    }
}

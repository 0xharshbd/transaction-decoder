import type { Hex } from "viem";

class DecoderError extends Error {
    constructor(message: string) {
        super(message);
    }
}

/**
 * Thrown when the calldata is invalid.
 */
export class InvalidCalldataError extends DecoderError {
    constructor() {
        super("Invalid calldata");
    }
}

export class DecoderAlreadyRegisteredError extends DecoderError {
    constructor(decoder: string, existing: string) {
        super(`Decoder for function ${decoder} already registered by ${existing}`);
    }
}

export class DecoderNotFoundError extends DecoderError {
    constructor(signature: Hex) {
        super(`Decoder for function ${signature} not found. Please register the decoder first.`);
    }
}
import type { Hex } from "viem";
import type { FunctionDefinition } from "./decoders";
import { formatAbiItem } from "viem/utils";

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
    constructor(existing: FunctionDefinition, current: FunctionDefinition) {
        const existingDefinition = formatAbiItem(existing.abi, { includeName: true });
        const currentDefinition = formatAbiItem(current.abi, { includeName: true });

        super(`Function '${currentDefinition}' already defined as '${existingDefinition}'. Please remove a duplicate definition from abi.`);
    }
}

export class DecoderNotFoundError extends DecoderError {
    constructor(signature: Hex) {
        super(`Decoder for function '${signature}' not found. Please register the decoder first.`);
    }
}
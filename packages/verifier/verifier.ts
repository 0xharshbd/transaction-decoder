import type { Hex } from "viem";
import { Decoders, type DecodedCalldata } from "../decoders/decoders";
import type { AbstractVerifierPlugin } from "../plugins/base-plugin";

interface VerifierOptions {
    plugins: AbstractVerifierPlugin[];
}

export class Verifier {
    private readonly decoders = new Decoders([]);

    constructor(options: VerifierOptions) {
        for (const plugin of options.plugins) {
            plugin.useDecoder(this.decoders);
        }
    }

    public decode<T>(calldata: Hex): DecodedCalldata<T> {
        return this.decoders.decodeCalldata(calldata);
    }
}

export function createVerifier(options: VerifierOptions) {
    return new Verifier(options);
}
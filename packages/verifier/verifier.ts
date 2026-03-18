import type { Hex } from "viem";
import { Decoders, type DecodedCalldata } from "../decoders/decoders";
import type { AbstractVerifierPlugin, Intent } from "../plugins/base-plugin";

interface VerifierOptions {
    plugins: AbstractVerifierPlugin[];
}

export class Verifier {
    private readonly decoder = new Decoders([]);

    private readonly intents: Map<Hex, Intent> = new Map();

    constructor(options: VerifierOptions) {
        for (const plugin of options.plugins) {
            plugin.useDecoder(this.decoder);

            for (const intent of plugin.getIntents()) {
                this.intents.set(intent.signature, intent);
            }
        }
    }

    public decode<T>(calldata: Hex): DecodedCalldata<T> {
        return this.decoder.decodeCalldata(calldata);
    }

    public getIntent(calldata: Hex) {
        const decoded = this.decode<any[]>(calldata);
        const intent = this.intents.get(decoded.signature);

        if (!intent) {
            throw new Error(`Intent for signature ${decoded.signature} not found`);
        }

        return { intent: intent.type, data: intent.transform(...decoded.args) };
    }


    public getDecoder() {
        return this.decoder;
    }
}

export function createVerifier(options: VerifierOptions) {
    return new Verifier(options);
}
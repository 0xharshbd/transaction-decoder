import type { Abi, Hex } from "viem";
import type { Decoders } from "../decoders/decoders";

export interface Intent {
    type: string;
    signature: Hex;
    transform: (...args: any[]) => any;
}


export abstract class AbstractVerifierPlugin {
    abstract getAbis(): Abi[];

    abstract getIntents(): Intent[];

    private decoder?: Decoders;

    public useDecoder(decoder: Decoders) {
        this.decoder = decoder;
        decoder.useABIs(this.getAbis());
    }

    public getDecoder() {
        if (!this.decoder) {
            throw new Error("Decoder is not initialized");
        }

        return this.decoder;
    }
}
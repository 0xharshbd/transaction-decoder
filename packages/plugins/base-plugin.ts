import type { Abi } from "viem";
import type { Decoders } from "../decoders/decoders";

export abstract class AbstractVerifierPlugin {
    protected abstract readonly abis: Abi[];

    public useDecoder(decoder: Decoders) {
        decoder.useABIs(this.abis);
    }
}
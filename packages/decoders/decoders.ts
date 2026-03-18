import { isHex, type Hex } from "viem";
import type { CalldataDecoder } from "./calldata-decoder";
import { DecoderAlreadyRegisteredError, DecoderNotFoundError, InvalidCalldataError } from "./errors";
import type { DecodedCalldata } from "../types/utilities";

export class Decoders {
    private decoders: Map<Hex, CalldataDecoder> = new Map();

    register(decoder: CalldataDecoder) {
        for (const func of decoder.extractFunctionSignatures()) {
            if (this.decoders.has(func.signature)) {
                const existing = this.decoders.get(func.signature);
                throw new DecoderAlreadyRegisteredError(func.name, existing?.constructor.name ?? "unknown");
            }

            this.decoders.set(func.signature, decoder);
        }
    }

    decodeCalldata<TDecoded>(calldata: Hex): DecodedCalldata<TDecoded> {
        if (!isHex(calldata)) {
            throw new InvalidCalldataError();
        }

        const signature = calldata.slice(0, 10) as Hex;
        const decoder = this.decoders.get(signature);

        if (!decoder) {
            throw new DecoderNotFoundError(signature);
        }

        return decoder.decodeCalldata(calldata);
    }

    *[Symbol.iterator]() {
        for (const decoder of new Set(this.decoders.values())) {
            for (const func of decoder.extractFunctionSignatures()) {
                yield {
                    name: func.name,
                    signature: func.signature,
                    definition: func.definition,
                };
            }
        }
    }
}
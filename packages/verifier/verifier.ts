import type { Hex } from "viem";
import { Decoders, type DecodedCalldata } from "../decoders/decoders";
import type { AbstractVerifierPlugin, Intent } from "../plugins/base-plugin";
import z from "zod";

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

    public getIntent<T extends any>(calldata: Hex): T {
        const decoded = this.decode<any[]>(calldata);
        const intent = this.intents.get(decoded.signature);

        if (!intent) {
            throw new Error(`Intent for signature ${decoded.signature} not found`);
        }

        return { intent: intent.type, data: intent.transform(...decoded.args) } as T;
    }

    /**
     * Check if the intent matches the zodshema
     * @param intent - The intent to check
     * @param zodshema - The zodshema to check against
     * @returns The result of the check
     */
    public async check(intent: any, zodshema: z.ZodType): Promise<{ valid: boolean, errors: any; }> {
        try {
            await z.parseAsync(zodshema, intent.data);
            return { valid: true, errors: null };
        } catch (error) {
            if (error instanceof z.ZodError) {
                return { valid: false, errors: z.treeifyError(error) };
            }

            throw error;
        }
    }


    public getDecoder() {
        return this.decoder;
    }
}

export function createVerifier(options: VerifierOptions) {
    return new Verifier(options);
}
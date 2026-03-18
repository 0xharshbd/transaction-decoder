import { isHex, type Abi, type AbiFunction, type Hex } from "viem";
import { decodeFunctionData, formatAbiItem, toFunctionSelector } from "viem/utils";

import { DecoderAlreadyRegisteredError, DecoderNotFoundError, InvalidCalldataError } from "./errors";

export interface FunctionDefinition {
    name: string;
    signature: Hex;
    abi: AbiFunction;
}

export interface DecodedCalldata<TArgs> {
    function: string;
    args: TArgs;
}


export class Decoders {
    /**
     * The map of function signatures to function definitions.
     */
    private readonly signatures: Map<Hex, FunctionDefinition> = new Map();

    /**
     * Create a new Decoders instance.
     * @param abis - The ABIs to register.
     */
    constructor(abis: Abi[]) {
        this.useABIs(abis);
    }

    /**
     * Extract the function signatures from the ABI.
     * @param abi - The ABI to extract the function signatures from.
     * @returns The function signatures.
     */
    private extractFunctionSignatures(abi: Abi): FunctionDefinition[] {
        const functions: FunctionDefinition[] = [];

        for (let i = 0; i < abi.length; i++) {
            const item = abi[i];
            if (item?.type !== "function") {
                continue;
            }

            const signature = toFunctionSelector(item);
            functions.push({ name: item.name, signature, abi: item });
        }

        return functions;
    }

    /**
     * Get the function definition for a given signature.
     * @param signature - The signature of the function.
     * @returns The function definition.
     */
    public getFunction(signature: Hex): FunctionDefinition {
        const definition = this.signatures.get(signature);
        if (!definition) {
            throw new DecoderNotFoundError(signature);
        }

        return definition;
    }

    /**
     * Get the name of the function for a given signature.
     * @param signature - The signature of the function.
     * @returns The name of the function.
     */
    public getFunctionName(signature: Hex): string {
        return this.getFunction(signature).name;
    }

    /**
     * Get the definition of the function for a given signature.
     * @param signature - The signature of the function.
     * @returns The definition of the function.
     */
    public getFunctionDefinition(signature: Hex): string {
        return formatAbiItem(this.getFunction(signature).abi, { includeName: true });
    }

    /**
     * Get the ABI of the function for a given signature.
     * @param signature - The signature of the function.
     * @returns The ABI of the function.
     */
    public getFunctionAbi(signature: Hex): AbiFunction {
        return this.getFunction(signature).abi;
    }

    public useABIs(abis: Abi[]): void {
        for (const abi of abis) {
            for (const func of this.extractFunctionSignatures(abi)) {
                if (this.signatures.has(func.signature)) {
                    const existing = this.signatures.get(func.signature);
                    throw new DecoderAlreadyRegisteredError(func.name, existing?.name ?? "unknown");
                }

                this.signatures.set(func.signature, func);
            }
        }
    }

    /**
     * Decode the calldata.
     * @param calldata - The calldata to decode.
     * @returns The decoded calldata.
     */
    public decodeCalldata<TDecoded>(calldata: Hex): DecodedCalldata<TDecoded> {
        if (!isHex(calldata)) {
            throw new InvalidCalldataError();
        }

        const signature = calldata.slice(0, 10) as Hex;
        const definition = this.getFunction(signature);

        const decoded = decodeFunctionData({
            abi: [definition.abi],
            data: calldata,
        });

        return { function: decoded.functionName, args: decoded.args as TDecoded };
    }

    *[Symbol.iterator]() {
        for (const signature of this.signatures.keys()) {
            yield {
                name: this.getFunctionName(signature),
                signature,
                definition: this.getFunctionDefinition(signature),
                abi: this.getFunctionAbi(signature),
            };
        }
    }
}
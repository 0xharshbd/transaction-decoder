import { decodeFunctionData, isHex, toFunctionSelector, type Abi, type Hex } from "viem";
import { formatAbiItem } from "viem/utils";
import { InvalidCalldataError } from "./errors";
import type { DecodedCalldata } from "../types/utilities";

export interface FunctionDefinition {
    name: string;
    signature: Hex;
    definition: string;
}

export class CalldataDecoder {
    private abi: Abi;

    constructor(abi: Abi) {
        this.abi = abi;
    }

    /**
     * Get the map of functions by bytes4 from the ABI.
     * @returns The map of functions by bytes4 from the ABI.
     */
    extractFunctionSignatures(): FunctionDefinition[] {
        const functions: FunctionDefinition[] = [];

        for (let i = 0; i < this.abi.length; i++) {
            const item = this.abi[i];
            if (item?.type !== "function") {
                continue;
            }

            const definition = formatAbiItem(item, { includeName: false });
            const signature = toFunctionSelector(item);
            functions.push({ name: item.name, signature, definition });
        }

        return functions;
    }

    public decodeCalldata<TDecoded>(calldata: Hex): DecodedCalldata<TDecoded> {
        if (!isHex(calldata)) {
            throw new InvalidCalldataError();
        }

        const decoded = decodeFunctionData({
            abi: this.abi,
            data: calldata,
        });

        return { function: decoded.functionName, args: decoded.args as TDecoded };
    }
}
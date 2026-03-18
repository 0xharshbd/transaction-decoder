import { describe, expect, it } from 'bun:test';
import type { Abi } from 'viem';

import { CalldataDecoder } from './calldata-decoder';
import { InvalidCalldataError } from './errors';
import IERC_20_ABI from '../abis/IERC_20.abi.json' with { type: "json" };

describe('CalldataDecoder', () => {
    const decoder = new CalldataDecoder(IERC_20_ABI as Abi);

    it("should create an instance", () => {
        expect(decoder).toBeDefined();
    });

    it("should decode the name function", () => {
        const calldata = "0xdd62ed3e000000000000000000000000be48eda75be2fe6af5a08749b21a6fbe49e14aa6000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
        const decoded = decoder.decodeCalldata(calldata);
        expect(decoded.function).toBe("allowance");
        expect(decoded.args).toHaveLength(2);
    });

    it("should throw an error if the calldata is invalid", () => {
        const calldata = "0xinvalid";
        expect(() => decoder.decodeCalldata(calldata)).toThrow(InvalidCalldataError);
    });

    it("should get the functions signatures from the abi", () => {
        const functions = decoder.extractFunctionSignatures();
        expect(functions).toBeDefined();

        for (const func of functions) {
            expect(func.signature).toBeDefined();
            expect(func.definition).toBeDefined();
            expect(func.name).toBeDefined();
        }
    });

});
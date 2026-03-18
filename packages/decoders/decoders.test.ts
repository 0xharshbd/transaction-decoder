import { describe, expect, it } from 'bun:test';

import { Decoders } from "./decoders";


import IERC_20_ABI from '../plugins/erc/abi/IERC_20.abi.json' with { type: "json" };
import type { Abi } from 'viem';
import { DecoderAlreadyRegisteredError, DecoderNotFoundError } from './errors';

describe('Decoders', () => {
    const decoders = new Decoders([IERC_20_ABI as Abi]);
    it('should decode calldata', () => {
        const decoded = decoders.decodeCalldata("0xdd62ed3e000000000000000000000000be48eda75be2fe6af5a08749b21a6fbe49e14aa6000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");

        expect(decoded.function).toBe("allowance");
        expect(decoded.args).toHaveLength(2);
    });

    it("should decode return the function definition", () => {
        const signature = "0xdd62ed3e";
        const definition = decoders.getFunctionDefinition(signature);
        expect(definition).toBe("allowance(address owner, address spender)");
    });

    it("should return the function name", () => {
        const signature = "0xdd62ed3e";
        const name = decoders.getFunctionName(signature);
        expect(name).toBe("allowance");
    });

    it("should return the function abi", () => {
        const signature = "0xdd62ed3e";
        const abi = decoders.getFunctionAbi(signature);
        expect(abi).toBeDefined();
        expect(abi.name).toBe("allowance");
        expect(abi.inputs).toHaveLength(2);
        expect(abi.outputs).toHaveLength(1);
    });

    it("should return throw an error if the function is not registered", () => {
        const signature = "0xinvalid";
        expect(() => decoders.getFunction(signature)).toThrow(DecoderNotFoundError);
    });

    it('should throw an error if the decoder is not registered', () => {
        const decoders = new Decoders([]);
        expect(() => decoders.decodeCalldata("0xdd62ed3e000000000000000000000000be48eda75be2fe6af5a08749b21a6fbe49e14aa6000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48")).toThrow(DecoderNotFoundError);
    });

    it("should add the abi to the decoders", () => {
        const decoders = new Decoders([]);
        decoders.useABIs([IERC_20_ABI as Abi]);
        expect(decoders.getFunction("0xdd62ed3e")).toBeDefined();
    });

    it("should throw an error if the abi is already registered", () => {
        const decoders = new Decoders([IERC_20_ABI as Abi]);
        expect(() => decoders.useABIs([IERC_20_ABI as Abi])).toThrow(DecoderAlreadyRegisteredError);
    });

    it('should return the functions signatures as an iterator', () => {
        const iterator = decoders[Symbol.iterator]();

        expect(iterator).toBeDefined();
        expect(iterator.next()).toBeDefined();
        expect(iterator.next()).toBeDefined();
    });
});
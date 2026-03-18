import { describe, expect, it } from 'bun:test';

import { Decoders } from "./decoders";
import { CalldataDecoder } from './calldata-decoder';


import IERC_20_ABI from '../abis/IERC_20.abi.json' with { type: "json" };
import type { Abi } from 'viem';
import { DecoderNotFoundError } from './errors';

describe('Decoders', () => {
    it('should register a decoder', () => {
        const decoders = new Decoders();
        decoders.register(new CalldataDecoder(IERC_20_ABI as Abi));
    });

    it('should decode calldata', () => {
        const decoders = new Decoders();
        decoders.register(new CalldataDecoder(IERC_20_ABI as Abi));


        const decoded = decoders.decodeCalldata("0xdd62ed3e000000000000000000000000be48eda75be2fe6af5a08749b21a6fbe49e14aa6000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");

        expect(decoded.function).toBe("allowance");
        expect(decoded.args).toHaveLength(2);
    });

    it('should throw an error if the decoder is not registered', () => {
        const decoders = new Decoders();
        expect(() => decoders.decodeCalldata("0xdd62ed3e000000000000000000000000be48eda75be2fe6af5a08749b21a6fbe49e14aa6000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48")).toThrow(DecoderNotFoundError);
    });

    it('should return the functions signatures as an iterator', () => {
        const decoders = new Decoders();
        decoders.register(new CalldataDecoder(IERC_20_ABI as Abi));
        const iterator = decoders[Symbol.iterator]();

        expect(iterator).toBeDefined();
        expect(iterator.next()).toBeDefined();
        expect(iterator.next()).toBeDefined();
    });
});
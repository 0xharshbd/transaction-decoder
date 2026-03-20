import { describe, expect, it } from 'bun:test';

import { encodeFunctionData, type Abi, type AbiFunction, type Hex } from 'viem';

import { TransactionVerifierSdkError } from '@package/error';

import { EvmCalldataDecoder } from './evm-calldata-decoder.ts';
import { FunctionHashDecoder } from './function-hash-decoder.ts';

const abiFunction: AbiFunction = {
    name: 'approve',
    type: 'function',
    inputs: [
        {
            name: 'spender',
            type: 'address',
        },
        {
            name: 'value',
            type: 'uint256',
        },
    ],
    outputs: [],
    stateMutability: 'view',
};

describe('Ethereum Calldata Decoder', () => {
    const abi: Abi = [abiFunction];
    const decoder = new EvmCalldataDecoder([abi]);
    const calldata = encodeFunctionData({
        abi: [abiFunction],
        args: ['0x0123456789012345678901234567890123456789', 1000n],
    });

    describe('getFunctionDecoder', () => {
        it('should get the function decoder for a given hash', () => {
            const hash = decoder.getFunctionHash(calldata);
            expect(decoder.getFunctionDecoder(hash)).toBeDefined();
            expect(decoder.getFunctionDecoder(hash).getFunctionHash()).toEqual(hash);
        });

        it('should throw an error if the function decoder is not found', () => {
            const decoder = new EvmCalldataDecoder();
            const hash = '0x095ea7b3';
            expect(() => decoder.getFunctionDecoder(hash)).toThrow(TransactionVerifierSdkError);
        });
    });

    describe('setFunctionHashDecoder', () => {
        it('should set the function decoder for a given hash', () => {
            const decoder = new EvmCalldataDecoder();
            const hash = '0x095ea7b3';
            const newDecoder = decoder.setFunctionHashDecoder(new FunctionHashDecoder(abiFunction));

            expect(newDecoder).toEqual(decoder);
            expect(decoder.getFunctionDecoder(hash)).toBeDefined();
            expect(decoder.getFunctionDecoder(hash).getFunctionHash()).toEqual(hash);
        });

        it('should throw an error if the function decoder is already set', () => {
            const decoder = new EvmCalldataDecoder();
            decoder.setFunctionHashDecoder(new FunctionHashDecoder(abiFunction));
            expect(() => decoder.setFunctionHashDecoder(new FunctionHashDecoder(abiFunction))).toThrow(TransactionVerifierSdkError);
        });
    });

    describe('getFunctionHash', () => {
        it('should get the function hash for a given calldata', () => {
            const hash = decoder.getFunctionHash(calldata);
            expect(hash).toEqual('0x095ea7b3');
        });

        it('should get the function decoder for a given function hash', () => {
            const hash = decoder.getFunctionHash(calldata);
            expect(hash).toEqual('0x095ea7b3');
        });

        it('should throw an error if the calldata is invalid', () => {
            const invalidCalldata = '0x';
            expect(() => decoder.getFunctionHash(invalidCalldata)).toThrow('Invalid calldata');
        });
    });

    describe('useAbi', () => {
        it('should use the ABI to set the function decoder', () => {
            const decoder = new EvmCalldataDecoder();
            const newDecoder = decoder.useAbi(abi);
            const hash = decoder.getFunctionHash(calldata);

            expect(newDecoder).toEqual(decoder);
            expect(decoder.getFunctionDecoder(hash)).toBeDefined();
            expect(decoder.getFunctionDecoder(hash).getFunctionHash()).toEqual(hash);
        });
    });

    describe('decode', () => {
        it('should throw an error if the function decoder is not found', () => {
            const decoder = new EvmCalldataDecoder();
            expect(() => decoder.decode<[Hex, bigint]>(calldata)).toThrow('Function decoder not found for hash: 0x095ea7b3');
        });

        it('should decode the calldata', () => {
            const result = decoder.decode<[Hex, bigint]>(calldata);

            if (!result) {
                throw new Error('Failed to decode the calldata');
            }

            const [spender, value] = result;
            expect(spender).toEqual('0x0123456789012345678901234567890123456789');
            expect(value).toEqual(1000n);
        });

        it('should throw an error if the function decoder is not found', () => {
            const decoder = new EvmCalldataDecoder();
            const calldata = encodeFunctionData({
                abi: [abiFunction],
                args: ['0x0123456789012345678901234567890123456789', 1000n],
            });
            expect(() => decoder.decode<[Hex, bigint]>(calldata)).toThrow('Function decoder not found for hash: 0x095ea7b3');
        });

        it('should return null if the calldata is empty', () => {
            const result = decoder.decode<[Hex, bigint]>('0x');
            expect(result).toBeNull();
        });
    });
});

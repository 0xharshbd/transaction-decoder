import { describe, expect, it } from 'bun:test';

import { encodeFunctionData, type AbiFunction, type Hex } from 'viem';

import { FunctionHashDecoder } from './function-hash-decoder.ts';

describe('FunctionHashDecoder', () => {
    const abi: AbiFunction = {
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

    const decoder = new FunctionHashDecoder(abi);
    it('should get the function hash', () => {
        const signature = decoder.getFunctionHash();
        expect(signature).toEqual('0x095ea7b3');
    });

    it('should get the function name', () => {
        const name = decoder.getFunctionName();
        expect(name).toEqual('approve');
    });

    it('should decode the function arguments', () => {
        type Args = [address: Hex, value: bigint];

        const args: Args = ['0x0123456789012345678901234567890123456789', 1000n];
        const calldata = encodeFunctionData({
            abi: [abi],
            args,
        });
        const [address, value] = decoder.decode<Args>(calldata);
        expect([address, value]).toEqual(args);
    });
});

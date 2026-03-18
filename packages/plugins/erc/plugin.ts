import type { Abi, Address } from "viem";

import { AbstractVerifierPlugin, type Intent } from "../base-plugin";
import IERC_20_ABI from "./abi/IERC_20.abi.json" with { type: "json" };
import IERC_7821_ABI from "./abi/IERC_7821.abi.json" with { type: "json" };

export class Erc20Plugin extends AbstractVerifierPlugin {

    readonly abis: Abi[] = [
        IERC_20_ABI as Abi,
    ];

    getAbis(): Abi[] {
        return this.abis;
    }

    getIntents(): Intent[] {
        return [
            {
                signature: "0x095ea7b3",
                type: "approve",
                transform: (spender: Address, value: bigint) => {
                    return {
                        spender: spender,
                        value: value,
                    };
                }
            },
            {
                type: "transfer",
                signature: "0xa9059cbb",
                transform: (to: Address, value: bigint) => {
                    return {
                        to: to,
                        value: value,
                    };
                }
            }
        ];
    }
}

export class Erc7821Plugin extends AbstractVerifierPlugin {
    override readonly abis: Abi[] = [
        IERC_7821_ABI as Abi,
    ];
}
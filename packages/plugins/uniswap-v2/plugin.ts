import type { Abi, Address } from "viem";

import UNISWAP_V2_ROUTER_ABI from "./abi/uniswap_v2_router.abi.json" with { type: "json" };
import { AbstractVerifierPlugin, type Intent } from "../base-plugin";


export class UniswapV2Plugin extends AbstractVerifierPlugin {
    public getIntents(): Intent[] {
        return this.intents;
    }

    public getAbis(): Abi[] {
        return this.abis;
    }

    readonly abis: Abi[] = [
        UNISWAP_V2_ROUTER_ABI as Abi,
    ];

    private readonly intents: Intent[] = [
        {
            signature: "0x38ed1739",
            type: "swap",
            transform: (amountIn: bigint, amountOutMin: bigint, path: [from: Address, to: Address], to: Address, deadline: bigint) => {
                return {
                    amountIn: amountIn,
                    amountOutMin: amountOutMin,
                    path: path,
                    to: to,
                    deadline: deadline,
                };
            }
        }
    ];
}

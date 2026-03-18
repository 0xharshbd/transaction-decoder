
import type { Abi } from "viem";
import { AbstractVerifierPlugin, type Intent } from "../base-plugin";

import KYBER_SWAP_META_AGGREGATION_ROUTER_V2_ABI from "./abi/kyberswap_meta_aggregation_router_v2.abi.json" with { type: "json" };

export class KyberswapPlugin extends AbstractVerifierPlugin {
    public getAbis(): Abi[] {
        return this.abis;
    }

    public getIntents(): Intent[] {
        return this.intents;
    }

    readonly abis: Abi[] = [
        KYBER_SWAP_META_AGGREGATION_ROUTER_V2_ABI as Abi,
    ];

    private readonly intents: Intent[] = [
        {
            signature: "0xe21fd0e9",
            type: "swap",
            transform: (...args: [{ desc: any; }]) => {
                return {
                    amountIn: args[0].desc.amount,
                    amountOutMin: args[0].desc.minReturnAmount,
                    path: [args[0].desc.srcToken, args[0].desc.dstToken],
                    to: args[0].desc.dstReceiver,
                    deadline: null,
                };
            }
        }
    ];
}
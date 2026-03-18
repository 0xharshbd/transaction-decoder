
import type { Abi } from "viem";
import { AbstractVerifierPlugin } from "../base-plugin";

import KYBER_SWAP_META_AGGREGATION_ROUTER_V2_ABI from "./abi/kyberswap_meta_aggregation_router_v2.abi.json" with { type: "json" };

export class KyberswapPlugin extends AbstractVerifierPlugin {
    override readonly abis: Abi[] = [
        KYBER_SWAP_META_AGGREGATION_ROUTER_V2_ABI as Abi,
    ];
}
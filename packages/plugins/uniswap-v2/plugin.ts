import type { Abi } from "viem";

import UNISWAP_V2_ROUTER_ABI from "./abi/uniswap_v2_router.abi.json" with { type: "json" };
import { AbstractVerifierPlugin } from "../base-plugin";

export class UniswapV2Plugin extends AbstractVerifierPlugin {
    override readonly abis: Abi[] = [
        UNISWAP_V2_ROUTER_ABI as Abi,
    ];
}

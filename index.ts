import type { Abi } from "viem";

import { Decoders } from "./packages/decoders/decoders";

import IERC_20_ABI from "./packages/abis/IERC_20.abi.json" with { type: "json" };
import IERC_7821_ABI from "./packages/abis/IERC_7821.abi.json" with { type: "json" };
import KYBER_SWAP_META_AGGREGATION_ROUTER_V2_ABI from "./packages/abis/kyberswap_meta_aggregation_router_v2.abi.json" with { type: "json" };
import UNISWAP_V2_ROUTER_ABI from "./packages/abis/uniswap_v2_router.abi.json" with { type: "json" };

export const decoder = new Decoders([
    IERC_20_ABI as Abi,
    IERC_7821_ABI as Abi,
    KYBER_SWAP_META_AGGREGATION_ROUTER_V2_ABI as Abi,
    UNISWAP_V2_ROUTER_ABI as Abi,
]);

export { Decoders, type FunctionDefinition, type DecodedCalldata } from "./packages/decoders/decoders";
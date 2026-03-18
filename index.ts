import type { Abi } from "viem";

import { CalldataDecoder } from "./packages/decoders/calldata-decoder";
import { Decoders } from "./packages/decoders/decoders";

import IERC_20_ABI from "./packages/abis/IERC_20.abi.json" with { type: "json" };
import IERC_7821_ABI from "./packages/abis/IERC_7821.abi.json" with { type: "json" };
import KYBER_SWAP_META_AGGREGATION_ROUTER_V2_ABI from "./packages/abis/kyberswap_meta_aggregation_router_v2.abi.json" with { type: "json" };

export const decoder = new Decoders();

decoder.register(new CalldataDecoder(IERC_20_ABI as Abi));
decoder.register(new CalldataDecoder(IERC_7821_ABI as Abi));
decoder.register(new CalldataDecoder(KYBER_SWAP_META_AGGREGATION_ROUTER_V2_ABI as Abi));

export { CalldataDecoder, type FunctionDefinition } from "./packages/decoders/calldata-decoder";
export { Decoders } from "./packages/decoders/decoders";
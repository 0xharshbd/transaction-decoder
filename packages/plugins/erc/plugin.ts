import type { Abi } from "viem";

import { AbstractVerifierPlugin } from "../base-plugin";
import IERC_20_ABI from "./abi/IERC_20.abi.json" with { type: "json" };
import IERC_7821_ABI from "./abi/IERC_7821.abi.json" with { type: "json" };

export class Erc20Plugin extends AbstractVerifierPlugin {
    override readonly abis: Abi[] = [
        IERC_20_ABI as Abi,
    ];
}

export class Erc7821Plugin extends AbstractVerifierPlugin {
    override readonly abis: Abi[] = [
        IERC_7821_ABI as Abi,
    ];
}
import { Erc20Plugin, Erc7821Plugin } from "./packages/plugins/erc/plugin";
import { KyberswapPlugin } from "./packages/plugins/kyberswap/plugin";
import { UniswapV2Plugin } from "./packages/plugins/uniswap-v2/plugin";
import { createVerifier } from "./packages/verifier/verifier";

export const verifier = createVerifier({
    plugins: [
        new Erc20Plugin(),
        new Erc7821Plugin(),

        new UniswapV2Plugin(),
        new KyberswapPlugin(),
    ],
});

export { Decoders, type FunctionDefinition, type DecodedCalldata } from "./packages/decoders/decoders";
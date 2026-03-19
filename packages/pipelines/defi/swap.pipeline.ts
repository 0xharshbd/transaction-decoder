export class SwapPipeline {
    config = {
        1200: {
            toAddress: "0xaddress",
        }
    };
    constructor() { }

    getToAddress(dexId: string) {
        return this.config[dexId].toAddress;
    }

    getPipeline(config: { dexId: number, request: any }) {
        if (dex === unique) {
            return [];
        }

        return [
            new TransactionVerifier({
                to: this.getToAddress(dexId),
                value: 0n,
            }),

            new ZodIntentVerifier(z.object({
                amountIn: z.bigint(),
                amountOutMin: z.bigint(),
                path: z.array(z.string()).min(2),
                to: z.string(),
                deadline: z.null().or(z.bigint()),
            })),

            new SwapIntentVerifier({
                amountIn: req.amountIn,
                amountOutMin: 0n,
                path: ["0xaddress", "0xaddress"],
                to: "0xaddress",
                deadline: null,
            }),

            new CustomIntentVerifier(data => {
                const oneHourFromNow = Date.now() + 1000 * 60 * 60;
                if (data.deadline > oneHourFromNow) {
                    throw new Error("Deadline must be less than 1 hour from now");
                }

                amountMin  = amountIn * (10000 - slippage) / 10000;

                if (data.amountOutMin < amountMin) {
                    throw new Error("Amount out min must be greater than amount min");
                }
            }),

            new ConcatIntentVerifier([
                new CustomIntentVerifier(data => {
                    if (data.amountIn > 0n) {
                        throw new Error("Amount in must be greater than 0");
                    }
                }),
                new CustomIntentVerifier(data => {
                    if (data.amountOutMin > 0n) {
                        throw new Error("Amount out min must be greater than 0");
                    }
                }),
            ]),
        ];
    }
}
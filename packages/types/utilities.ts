export type Hex = `0x${string}` & { _brand: "hex"; };

export interface DecodedCalldata<TArgs> {
    function: string;
    args: TArgs;
}
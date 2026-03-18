import { decoder } from "..";

const list = Array.from(decoder);

const maxName = Math.max(4, ...list.map((f) => f.name.length));
const maxSig = Math.max(10, ...list.map((f) => f.signature.length));
const maxDef = Math.max(11, ...list.map((f) => f.definition.length));
const pad = (s: string, n: number) => s.padEnd(n);

console.log("Total decoders:", list.length);
console.log();
console.log(pad("name", maxName), "|", pad("signature", maxSig), "|", pad("definition", maxDef));
console.log("-".repeat(maxName), "+", "-".repeat(maxSig), "+", "-".repeat(maxDef));

for (const func of list) {
    console.log(pad(func.name, maxName), "|", pad(func.signature, maxSig), "|", pad(func.definition, maxDef));
}
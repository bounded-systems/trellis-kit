import { assertEquals } from "@std/assert";
import {
  BUILD,
  findCycles,
  findMultiContractPairs,
  NodeDeclSchema,
  SELF,
  toDerivation,
} from "./mod.ts";

Deno.test("NodeDeclSchema validates a declaration", () => {
  const d = NodeDeclSchema.parse({
    node: "door-keeper",
    visibility: "public",
    provides: [{ type: "keeper-wire", kind: "wire", spec: { verbspec: "x" } }],
    consumes: [{ type: "door-kit-mirror" }],
  });
  assertEquals(d.node, "door-keeper");
});

Deno.test("toDerivation: output is build+provides, input is self+consumes", () => {
  const d = toDerivation({
    node: "brand",
    visibility: "public",
    provides: [{ type: "brand-tokens", kind: "shared-schema", spec: {} }],
    consumes: [{ type: "design-system-structure" }],
  });
  assertEquals(d.outputs, [BUILD, "brand-tokens"]);
  assertEquals(d.inputs, [SELF, "design-system-structure"]);
  assertEquals(d.mapped, true);
});

Deno.test("findCycles detects a mutual dependency", () => {
  const cycles = findCycles([{ from: "a", to: "b" }, { from: "b", to: "a" }]);
  assertEquals(cycles.length, 1);
  assertEquals([...cycles[0]].sort(), ["a", "b"]);
});

Deno.test("findMultiContractPairs flags a pair with two agreements", () => {
  // a<->b hold two contracts (opposite directions) — one-per-pair violation
  const v = findMultiContractPairs([
    { from: "a", to: "b", type: "wire" },
    { from: "b", to: "a", type: "mirror" },
    { from: "c", to: "d", type: "wire" }, // fine — single agreement
  ]);
  assertEquals(v.length, 1);
  assertEquals(v[0].pair.sort(), ["a", "b"]);
  assertEquals(v[0].contracts.sort(), ["mirror", "wire"]);
});

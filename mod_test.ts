import { assertEquals } from "@std/assert";
import {
  BUILD,
  coverage,
  findCycles,
  findMultiContractPairs,
  NodeDeclSchema,
  projectVerbSpec,
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

Deno.test("projectVerbSpec: methods + input field names (dependency-free)", () => {
  // a VerbSpec-shaped registry — only input.shape is read
  const registry = {
    "import-and-push": {
      input: { shape: { repo: 0, bundleBase64: 0, ledgerRef: 0 } },
    },
    status: { input: { shape: {} } },
  };
  const m = projectVerbSpec("keeper-wire", registry);
  assertEquals(m.type, "keeper-wire");
  assertEquals(m.methods, ["import-and-push", "status"]);
  assertEquals(m.params["import-and-push"], [
    "repo",
    "bundleBase64",
    "ledgerRef",
  ]);
  assertEquals(m.params.status, []);
});

Deno.test("coverage: mapped vs unmapped repos", () => {
  const c = coverage([
    {
      node: "brand",
      visibility: "public",
      provides: [{ type: "brand-tokens", kind: "shared-schema", spec: {} }],
      consumes: [],
    },
    { node: "lonely", visibility: "public", provides: [], consumes: [] },
  ]);
  assertEquals(c.total, 2);
  assertEquals(c.mapped, 1);
  assertEquals(c.unmapped, ["lonely"]);
});

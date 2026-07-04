# @bounded-systems/trellis-kit

The spec/SDK that **defines a contract** in the bounded-systems lattice — the one
canonical definition [`trellis`](https://github.com/bounded-systems/trellis),
its private sidecar, and every repo's own `trellis.json` import, rather than each
re-deriving it.

A **contract is the pinned agreement between two services**. This package pins
what that agreement *is*.

## The model

Every repo is a **build derivation**:

- **output** = the non-negotiable `build` (every repo produces its build
  artifact) + the contract types it **provides**.
- **input** = `self` (its own source) + the contract types it **consumes**.
  _(Deploy outputs + external deps are a planned extension.)_

Contracts are matched by **type**, never by repo name: a provider of type `T` is
the agreement for every consumer of `T`.

## The invariants

- **One agreement per pair.** There is at most **one** contract between any two
  nodes. `findMultiContractPairs` returns violations — two repos holding two
  agreements (e.g. a wire protocol *and* a vendoring) must consolidate to one, or
  route one through a **contract-only repo**.
- **The lattice is a build DAG.** `findCycles` returns dependency cycles
  (consumer → provider). A cycle is a defect — broken by the same move: extract
  the shared agreement into its own contract-only repo that both sides pin.

## API

```ts
import {
  NodeDeclSchema, // Zod: a repo's own declaration (its trellis.json)
  toDerivation, // NodeDecl → { outputs, inputs, mapped }
  findCycles, // edges → dependency cycles (must be empty)
  findMultiContractPairs, // edges → pairs with >1 agreement (must be empty)
  BUILD,
  SELF, // the baseline output/input every repo has
} from "@bounded-systems/trellis-kit";
```

The Zod schemas are canonical (runtime validation + static types); a repo drops
a `trellis.json`, validates it with `NodeDeclSchema`, and `trellis` assembles the
graph from every repo's declaration.

## License

Source-available under **PolyForm Noncommercial 1.0.0**.

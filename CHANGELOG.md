# Changelog

## 0.4.0 — 2026-07-08

### Minor

- `DescriptorSchema` — model `descriptor.proof.claims[]` (`{ claim, provenBy, via }`) on `NodeDecl` via new `Descriptor` / `Proof` / `ProofClaim` schemas. Known fields are validated (a claim missing `provenBy` is rejected); extra descriptor keys are preserved via `catchall` so the block stays open for descriptor-kit. Optional, so backward compatible.

## 0.3.0 — 2026-07-05

### Minor

- projectVerbSpec accepts a real VerbSpec registry without a cast — its input param is typed `{ input: unknown }` so `Record<string, VerbSpec>` passes directly (the shape access is narrowed internally)


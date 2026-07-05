# Changelog

## 0.3.0 — 2026-07-05

### Minor

- projectVerbSpec accepts a real VerbSpec registry without a cast — its input param is typed `{ input: unknown }` so `Record<string, VerbSpec>` passes directly (the shape access is narrowed internally)


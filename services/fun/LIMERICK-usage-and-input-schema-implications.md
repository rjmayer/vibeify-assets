
## 3) Input schema implications (derived)

From the new template, the derived input schema must now:

* include `PROTAGONIST` and `ORIGIN` in `properties`
* **not** add them to `required`
* keep `additionalProperties: false` (so `domainParameters` is impossible)

This enables strict CLI overrides:

```bash
vibeify run services/fun/write-a-limerick.prompt.v1.yaml \
  --set PROTAGONIST="Poker pro" \
  --set ORIGIN="Stoke-on-Trent"
```

…and rejects invalid keys deterministically (e.g. `--set domainParameters.protagonist=…`, or `--set protagonist=…`).


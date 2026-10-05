# Contributing

Thanks for contributing to IP-SAKTI Sahayak. Because the project deals with legal/regulatory information, correctness and traceability are more important than answer fluency.

## Principles

- Do not add uncited legal or regulatory claims to the knowledge corpus.
- Keep India and International materials explicitly separated.
- Record source version/effective-date metadata whenever available.
- Prefer safe abstention over unsupported guidance.
- Never add private or paid material without documented permission.
- Keep the standing disclaimer visible: **information, not legal advice**.

## Development flow

1. Create a feature branch.
2. Add or update tests.
3. Run backend tests and frontend build.
4. Open a pull request describing source and behavior changes.

## Local checks

```bash
cd backend && pytest
cd ../frontend && npm install && npm run build
```

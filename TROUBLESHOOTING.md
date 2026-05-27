# Troubleshooting

Common problems and solutions when working with the SimpleCalc workspace.

1) Install fails or packages missing
- Remove `node_modules` and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

- Ensure your Node.js version is recent (LTS recommended — >=18). Use `node -v` to check.

2) Tests fail with `React is not defined` in tests
- Include `import React from 'react';` at the top of any test file that uses JSX if your environment doesn't auto-inject React.

3) Framer Motion errors around `matchMedia.addListener` or reduced-motion
- JSDOM and older test environments may not implement `matchMedia` fully. Add a robust mock to `src/setupTests.js` or before running tests:

```js
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
  });
}
```

4) Coverage fails: `Cannot find dependency '@vitest/coverage-v8'`
- Install the adapter:

```bash
cd frontend
npm install --save-dev @vitest/coverage-v8
```

5) Vitest CLI: duplicate `--run` flag error
- Don't pass `--run` multiple times. Use either `npm run test:ci -- <files>` or `npx vitest run -- <files>`.

6) ESBuild transform JSX error (unexpected closing tag)
- This usually indicates mismatched JSX tags in a file (e.g., `motion.div` opened but closed with `</div>`). Check the indicated file/line and correct tag mismatches.

7) Backend connection issues
- Confirm the backend is running and `VITE_API_URL` (or the environment variable used) points to the correct URL. Check network/firewall settings if running in a container.

8) Slow test collect or heavy environment setup
- Run targeted tests during development (e.g., `npm run test:ci -- src/__tests__/SomeTest.jsx`) and run full suite in CI.

If problems persist, open an issue with the failing command, exact error text, and node/npm versions. Include a minimal reproduction if possible.

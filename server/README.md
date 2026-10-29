# .

To install dependencies:

```bash
bun install
```

To run (Node.js 24+):

```bash
bun run start
```

The installed Mongoose/MongoDB driver requires Node.js at runtime; Bun 1.3.14
cannot import it because it does not implement the driver's `node:v8` API use.

Run the backend regression suite with:

```bash
bun run test
```

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

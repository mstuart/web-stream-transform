import test from "ava";
import { takeStream } from "./index.js";

test("takeStream(0) closes without waiting for an upstream chunk", async (t) => {
  const transform = takeStream(0);
  const reader = transform.readable.getReader();
  let timeout;
  try {
    const result = await Promise.race([
      reader.read(),
      new Promise((resolve) => {
        timeout = setTimeout(() => resolve("still pending"), 100);
      }),
    ]);
    t.deepEqual(result, { done: true, value: undefined });
  } finally {
    clearTimeout(timeout);
    await reader.cancel();
  }
});

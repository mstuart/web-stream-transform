<div align="center">
  <img src="docs/assets/logo.svg" alt="web-stream-transform — Functional transform helpers for Web Streams — map, filter, take, batch, and tap" width="720">
</div>

<p align="center"><strong>Functional transform helpers for Web Streams — map, filter, take, batch, and tap</strong></p>

<p align="center">
  <a href="https://github.com/mstuart/web-stream-transform/actions/workflows/main.yml"><img src="https://github.com/mstuart/web-stream-transform/actions/workflows/main.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://www.npmjs.com/package/web-stream-transform"><img src="https://img.shields.io/npm/v/web-stream-transform?label=npm" alt="npm"></a>
  <a href="https://deepwiki.com/mstuart/web-stream-transform"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
  <a href="https://socket.dev/npm/package/web-stream-transform"><img src="https://socket.dev/api/badge/npm/package/web-stream-transform" alt="Socket"></a>
  <img src="https://img.shields.io/badge/node-%E2%89%A520-339933.svg" alt="Node 20+">
</p>

---
## Install

```sh
npm install web-stream-transform
```

## Usage

```js
import {mapStream, filterStream, takeStream, batchStream, tapStream} from 'web-stream-transform';

const result = ReadableStream.from([1, 2, 3, 4, 5, 6])
	.pipeThrough(filterStream(x => x % 2 === 0))
	.pipeThrough(mapStream(x => x * 10))
	.pipeThrough(takeStream(2));
// Yields: 20, 40
```

## API

### mapStream(function_)

Returns a `TransformStream` that applies `function_` to each chunk.

### filterStream(function_)

Returns a `TransformStream` that only passes chunks where `function_` returns `true`.

### takeStream(count)

Returns a `TransformStream` that passes only the first `count` chunks then terminates.

### batchStream(size)

Returns a `TransformStream` that collects chunks into arrays of `size`, flushing any remainder on close.

### tapStream(function_)

Returns a `TransformStream` that calls `function_` for side effects but passes chunks through unchanged.

## Related

- [node:stream/web](https://nodejs.org/api/webstreams.html) - Node.js Web Streams API

## License

MIT

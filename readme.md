# web-stream-transform

> Functional transform helpers for Web Streams — map, filter, take, batch, and tap

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

/**
Create a TransformStream that applies an async function to each chunk.

@param function_ - The function to apply to each chunk.
@returns A TransformStream that maps each chunk.

@example
```
import {mapStream} from 'web-stream-transform';

const doubled = ReadableStream.from([1, 2, 3]).pipeThrough(mapStream(x => x * 2));
```
*/
export function mapStream<I, O>(function_: (chunk: I) => O | Promise<O>): TransformStream<I, O>;

/**
Create a TransformStream that filters chunks based on a predicate function.

@param function_ - The predicate function. Chunks where this returns false are dropped.
@returns A TransformStream that filters chunks.

@example
```
import {filterStream} from 'web-stream-transform';

const evens = ReadableStream.from([1, 2, 3, 4]).pipeThrough(filterStream(x => x % 2 === 0));
```
*/
export function filterStream<T>(function_: (chunk: T) => boolean | Promise<boolean>): TransformStream<T, T>;

/**
Create a TransformStream that passes only the first `count` chunks.

@param count - The number of chunks to pass through.
@returns A TransformStream that limits chunks.

@example
```
import {takeStream} from 'web-stream-transform';

const first2 = ReadableStream.from([1, 2, 3, 4]).pipeThrough(takeStream(2));
```
*/
export function takeStream<T>(count: number): TransformStream<T, T>;

/**
Create a TransformStream that collects chunks into arrays of a given size.

@param size - The batch size.
@returns A TransformStream that batches chunks.

@example
```
import {batchStream} from 'web-stream-transform';

const batched = ReadableStream.from([1, 2, 3, 4, 5]).pipeThrough(batchStream(2));
// Yields: [1, 2], [3, 4], [5]
```
*/
export function batchStream<T>(size: number): TransformStream<T, T[]>;

/**
Create a TransformStream that calls a function for side effects but passes chunks through unchanged.

@param function_ - The function to call for each chunk.
@returns A TransformStream that taps into the stream.

@example
```
import {tapStream} from 'web-stream-transform';

const logged = ReadableStream.from([1, 2, 3]).pipeThrough(tapStream(x => console.log(x)));
```
*/
export function tapStream<T>(function_: (chunk: T) => void | Promise<void>): TransformStream<T, T>;

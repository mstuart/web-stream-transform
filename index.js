/**
Create a TransformStream that applies an async function to each chunk.

@param {Function} function_ - The function to apply to each chunk.
@returns {TransformStream} A TransformStream that maps each chunk.
*/
export function mapStream(function_) {
	return new TransformStream({
		async transform(chunk, controller) {
			controller.enqueue(await function_(chunk));
		},
	});
}

/**
Create a TransformStream that filters chunks based on a predicate function.

@param {Function} function_ - The predicate function. Chunks where this returns false are dropped.
@returns {TransformStream} A TransformStream that filters chunks.
*/
export function filterStream(function_) {
	return new TransformStream({
		async transform(chunk, controller) {
			if (await function_(chunk)) {
				controller.enqueue(chunk);
			}
		},
	});
}

/**
Create a TransformStream that passes only the first `count` chunks.

@param {number} count - The number of chunks to pass through.
@returns {TransformStream} A TransformStream that limits chunks.
*/
export function takeStream(count) {
	let taken = 0;
	return new TransformStream({
		transform(chunk, controller) {
			if (taken < count) {
				taken++;
				controller.enqueue(chunk);
			}

			if (taken >= count) {
				controller.terminate();
			}
		},
	});
}

/**
Create a TransformStream that collects chunks into arrays of a given size.

@param {number} size - The batch size.
@returns {TransformStream} A TransformStream that batches chunks.
*/
export function batchStream(size) {
	let buffer = [];
	return new TransformStream({
		transform(chunk, controller) {
			buffer.push(chunk);
			if (buffer.length >= size) {
				controller.enqueue(buffer);
				buffer = [];
			}
		},
		flush(controller) {
			if (buffer.length > 0) {
				controller.enqueue(buffer);
			}
		},
	});
}

/**
Create a TransformStream that calls a function for side effects but passes chunks through unchanged.

@param {Function} function_ - The function to call for each chunk.
@returns {TransformStream} A TransformStream that taps into the stream.
*/
export function tapStream(function_) {
	return new TransformStream({
		async transform(chunk, controller) {
			await function_(chunk);
			controller.enqueue(chunk);
		},
	});
}

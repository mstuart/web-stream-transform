import test from 'ava';
import {
	mapStream,
	filterStream,
	takeStream,
	batchStream,
	tapStream,
} from './index.js';

async function collectStream(readable) {
	const results = [];
	const reader = readable.getReader();
	for (;;) {
		const {done, value} = await reader.read(); // eslint-disable-line no-await-in-loop
		if (done) {
			break;
		}

		results.push(value);
	}

	return results;
}

function createReadable(items) {
	return new ReadableStream({
		start(controller) {
			for (const item of items) {
				controller.enqueue(item);
			}

			controller.close();
		},
	});
}

// MapStream tests

test('mapStream transforms each chunk', async t => {
	const result = await collectStream(
		createReadable([1, 2, 3]).pipeThrough(mapStream(x => x * 2)),
	);
	t.deepEqual(result, [2, 4, 6]);
});

test('mapStream works with async functions', async t => {
	const result = await collectStream(
		createReadable(['a', 'b']).pipeThrough(mapStream(async x => x.toUpperCase())),
	);
	t.deepEqual(result, ['A', 'B']);
});

test('mapStream handles empty stream', async t => {
	const result = await collectStream(
		createReadable([]).pipeThrough(mapStream(x => x * 2)),
	);
	t.deepEqual(result, []);
});

test('mapStream transforms to different types', async t => {
	const result = await collectStream(
		createReadable([1, 2, 3]).pipeThrough(mapStream(String)),
	);
	t.deepEqual(result, ['1', '2', '3']);
});

// FilterStream tests

test('filterStream keeps matching chunks', async t => {
	const result = await collectStream(
		createReadable([1, 2, 3, 4, 5]).pipeThrough(filterStream(x => x % 2 === 0)),
	);
	t.deepEqual(result, [2, 4]);
});

test('filterStream removes all when none match', async t => {
	const result = await collectStream(
		createReadable([1, 3, 5]).pipeThrough(filterStream(x => x % 2 === 0)),
	);
	t.deepEqual(result, []);
});

test('filterStream keeps all when all match', async t => {
	const result = await collectStream(
		createReadable([2, 4, 6]).pipeThrough(filterStream(x => x % 2 === 0)),
	);
	t.deepEqual(result, [2, 4, 6]);
});

test('filterStream works with async predicate', async t => {
	const result = await collectStream(
		createReadable([1, 2, 3]).pipeThrough(filterStream(async x => x > 1)),
	);
	t.deepEqual(result, [2, 3]);
});

test('filterStream handles empty stream', async t => {
	const result = await collectStream(
		createReadable([]).pipeThrough(filterStream(() => true)),
	);
	t.deepEqual(result, []);
});

// TakeStream tests

test('takeStream limits output to count', async t => {
	const result = await collectStream(
		createReadable([1, 2, 3, 4, 5]).pipeThrough(takeStream(3)),
	);
	t.deepEqual(result, [1, 2, 3]);
});

test('takeStream returns all when count exceeds length', async t => {
	const result = await collectStream(
		createReadable([1, 2]).pipeThrough(takeStream(5)),
	);
	t.deepEqual(result, [1, 2]);
});

test('takeStream returns empty for count 0', async t => {
	const result = await collectStream(
		createReadable([1, 2, 3]).pipeThrough(takeStream(0)),
	);
	t.deepEqual(result, []);
});

test('takeStream takes exactly 1', async t => {
	const result = await collectStream(
		createReadable([10, 20, 30]).pipeThrough(takeStream(1)),
	);
	t.deepEqual(result, [10]);
});

// BatchStream tests

test('batchStream groups chunks into arrays', async t => {
	const result = await collectStream(
		createReadable([1, 2, 3, 4]).pipeThrough(batchStream(2)),
	);
	t.deepEqual(result, [[1, 2], [3, 4]]);
});

test('batchStream flushes remainder', async t => {
	const result = await collectStream(
		createReadable([1, 2, 3, 4, 5]).pipeThrough(batchStream(2)),
	);
	t.deepEqual(result, [[1, 2], [3, 4], [5]]);
});

test('batchStream with size 1 wraps each chunk', async t => {
	const result = await collectStream(
		createReadable([1, 2, 3]).pipeThrough(batchStream(1)),
	);
	t.deepEqual(result, [[1], [2], [3]]);
});

test('batchStream handles empty stream', async t => {
	const result = await collectStream(
		createReadable([]).pipeThrough(batchStream(3)),
	);
	t.deepEqual(result, []);
});

test('batchStream with size larger than input', async t => {
	const result = await collectStream(
		createReadable([1, 2]).pipeThrough(batchStream(5)),
	);
	t.deepEqual(result, [[1, 2]]);
});

test('batchStream exact multiple', async t => {
	const result = await collectStream(
		createReadable([1, 2, 3, 4, 5, 6]).pipeThrough(batchStream(3)),
	);
	t.deepEqual(result, [[1, 2, 3], [4, 5, 6]]);
});

// TapStream tests

test('tapStream passes chunks through unchanged', async t => {
	const result = await collectStream(
		createReadable([1, 2, 3]).pipeThrough(tapStream(() => {})),
	);
	t.deepEqual(result, [1, 2, 3]);
});

test('tapStream calls function for side effects', async t => {
	const seen = [];
	const result = await collectStream(
		createReadable([1, 2, 3]).pipeThrough(tapStream(x => seen.push(x))),
	);
	t.deepEqual(result, [1, 2, 3]);
	t.deepEqual(seen, [1, 2, 3]);
});

test('tapStream works with async side effects', async t => {
	const seen = [];
	const result = await collectStream(
		createReadable(['a', 'b']).pipeThrough(tapStream(async x => {
			seen.push(x);
		})),
	);
	t.deepEqual(result, ['a', 'b']);
	t.deepEqual(seen, ['a', 'b']);
});

test('tapStream handles empty stream', async t => {
	const seen = [];
	const result = await collectStream(
		createReadable([]).pipeThrough(tapStream(x => seen.push(x))),
	);
	t.deepEqual(result, []);
	t.deepEqual(seen, []);
});

// Chaining tests

test('chaining multiple transforms with pipeThrough', async t => {
	const result = await collectStream(
		createReadable([1, 2, 3, 4, 5, 6])
			.pipeThrough(filterStream(x => x % 2 === 0))
			.pipeThrough(mapStream(x => x * 10))
			.pipeThrough(takeStream(2)),
	);
	t.deepEqual(result, [20, 40]);
});

test('chaining filter then batch', async t => {
	const result = await collectStream(
		createReadable([1, 2, 3, 4, 5, 6, 7, 8])
			.pipeThrough(filterStream(x => x > 2))
			.pipeThrough(batchStream(3)),
	);
	t.deepEqual(result, [[3, 4, 5], [6, 7, 8]]);
});

test('chaining tap then map', async t => {
	const seen = [];
	const result = await collectStream(
		createReadable([1, 2, 3])
			.pipeThrough(tapStream(x => seen.push(x)))
			.pipeThrough(mapStream(x => x + 100)),
	);
	t.deepEqual(seen, [1, 2, 3]);
	t.deepEqual(result, [101, 102, 103]);
});

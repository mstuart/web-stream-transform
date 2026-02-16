import {expectType} from 'tsd';
import {
	mapStream,
	filterStream,
	takeStream,
	batchStream,
	tapStream,
} from './index.js';

expectType<TransformStream<number, string>>(mapStream<number, string>(String));
expectType<TransformStream<number, number>>(filterStream<number>(x => x > 0));
expectType<TransformStream<number, number>>(takeStream<number>(5));
expectType<TransformStream<number, number[]>>(batchStream<number>(3));
expectType<TransformStream<string, string>>(tapStream<string>(x => console.log(x)));

// Async functions should also work
expectType<TransformStream<number, string>>(mapStream<number, string>(async x => String(x)));
expectType<TransformStream<number, number>>(filterStream<number>(async x => x > 0));

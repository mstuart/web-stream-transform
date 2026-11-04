import { expectType } from "tsd";
import {
  batchStream,
  filterStream,
  mapStream,
  takeStream,
  tapStream,
} from "./index.js";

expectType<TransformStream<number, string>>(mapStream<number, string>(String));
expectType<TransformStream<number, number>>(filterStream<number>((x) => x > 0));
expectType<TransformStream<number, number>>(takeStream<number>(5));
expectType<TransformStream<number, number[]>>(batchStream<number>(3));
expectType<TransformStream<string, string>>(
  tapStream<string>((x) => console.log(x))
);

// Async functions should also work
expectType<TransformStream<number, string>>(
  mapStream<number, string>(async (x) => String(x))
);
expectType<TransformStream<number, number>>(
  filterStream<number>(async (x) => x > 0)
);

declare const value: PromiseLike<number>;
declare const condition: PromiseLike<boolean>;
declare const effect: PromiseLike<void>;
expectType<TransformStream<number, number>>(
  mapStream<number, PromiseLike<number>>(() => value)
);
expectType<TransformStream<number, number>>(
  filterStream<number>(() => condition)
);
expectType<TransformStream<number, number>>(tapStream<number>(() => effect));

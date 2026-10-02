import type en from "./dictionaries/en";

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { readonly [K in keyof T]: Widen<T[K]> };

/** Every locale must provide exactly this shape; a missing key fails type-checking. */
export type Dictionary = Widen<typeof en>;

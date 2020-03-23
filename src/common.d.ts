type ObjectDictionary<T> = { [key: string]: T };
type ArrayDictionary<T> = { [key: string]: T[] };
declare type Dictionary<T> = T extends any[] ? ArrayDictionary<T[number]> : ObjectDictionary<T>;


import { createAction } from "typesafe-actions";

export const pending = createAction("@loading/PENDING")();
export const success = createAction("@loading/SUCCESS")();
export const failure = createAction("@loading/FAILURE")();

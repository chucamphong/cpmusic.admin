import { TypedUseSelectorHook, useSelector as useReduxSelector } from "react-redux";
import { RootState } from "store/types";

const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export default useSelector;

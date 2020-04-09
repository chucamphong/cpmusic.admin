import { Ability } from "@casl/ability";
import { createContextualCan } from "@casl/react";
import { createContext } from "react";

export const AbilityContext = createContext<Ability>({} as Ability);
export const Can = createContextualCan(AbilityContext.Consumer);

export default AbilityContext;

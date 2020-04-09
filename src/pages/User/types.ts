import { User } from "modules/Auth";
import * as actions from "pages/User/store/actions";
import { ActionType } from "typesafe-actions";

export type UserList = User[];

export type UserState = {
    list?: UserList;
    status?: "pending" | "success" | "error";
};

export type UserAction = ActionType<typeof actions>;

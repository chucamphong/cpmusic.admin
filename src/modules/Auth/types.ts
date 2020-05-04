import { SubjectRawRule } from "@casl/ability";
import { actions } from "modules/Auth";
import { ActionType } from "typesafe-actions";

export type Credentials = {
    email: string;
    password: string;
}

export enum Role {
    Admin = "admin",
    Moderator = "mod",
    Member = "member",
}

export type User = {
    id: number;
    name: string;
    email: string;
    password?: string;
    avatar: string;
    email_verified_at: string;
    role: string;
    permissions: SubjectRawRule<"create" | "view" | "update" | "delete", any, any>[]
}

export type LoginResponse = {
    plainTextToken: string;
    expires: number;
}

export type LoginFailedResponse = {
    message: string;
    errors: Dictionary<string>;
}

export type AuthState = {
    message?: string;
    errors?: Dictionary<string>;
    status?: "pending" | "success" | "error";
    plainTextToken?: string;
    user?: User;
};

export type AuthAction = ActionType<typeof actions>;

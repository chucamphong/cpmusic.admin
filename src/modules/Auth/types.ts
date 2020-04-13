import { SubjectRawRule } from "@casl/ability";
import { actions } from "modules/Auth";
import { ActionType } from "typesafe-actions";

export type Credentials = {
    email: string;
    password: string;
}

export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    role: string;
    permissions: SubjectRawRule<string, string, unknown>[]
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

import { Rule } from "antd/es/form";

export type Rules = {
    email: Rule[],
    password: Rule[]
}

export type FieldData = Record<"email" | "password", string>;

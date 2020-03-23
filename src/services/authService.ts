import service from "./service";
import { AxiosRequestConfig } from "axios";
import { LoginResponse, User } from "modules/Auth/types";

function login(email: string, password: string) {
    return service.post<LoginResponse>("login", { email, password });
}

function me(config?: AxiosRequestConfig) {
    return service.get<User>("users/me", config);
}

function logout() {
    return service.post("logout");
}

export default {
    login,
    logout,
    me
};
import { AxiosRequestConfig } from "axios";
import { LoginResponse, User } from "modules/Auth";
import http from "services/http";

class AuthService {
    public login(email: string, password: string) {
        return http.post<LoginResponse>("login", { email, password });
    }

    public me(config?: AxiosRequestConfig) {
        return http.get<User>("users/me", config);
    }

    public logout() {
        return http.post("logout");
    }
}

export default AuthService;

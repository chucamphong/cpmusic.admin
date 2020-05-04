import { User } from "modules/Auth";
import { Service } from "./service";

export default class UserService extends Service<User> {
    constructor() {
        super("users");
    }

    public uploadAvatar(data: FormData) {
        return this.http.post(this.url("avatar"), data);
    }
}

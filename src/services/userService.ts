import { User } from "modules/Auth";
import { Service } from "./service";

export default class UserService extends Service<User> {
    constructor() {
        super("users");
    }

    public uploadAvatar(formData: FormData) {
        formData.append("type", "user");
        return this.http.post("upload", formData);
    }
}

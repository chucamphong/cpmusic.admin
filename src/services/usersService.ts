import { User } from "modules/Auth";
import service from "./service";

function fetch(query: string) {
    return service.get(query);
}

function getUser(userId: number) {
    return service.get(`/users/${userId}`);
}

function update(userId: number, data: Partial<User>) {
    return service.patch(`/users/${userId}`, data);
}

function uploadAvatar(data: FormData) {
    return service.post("/users/avatar", data);
}

function remove(userId: number) {
    return service.delete(`/users/${userId}`);
}

export default {
    fetch,
    getUser,
    update,
    uploadAvatar,
    remove,
};

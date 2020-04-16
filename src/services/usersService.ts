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

function remove(userId: number) {
    return service.delete(`/users/${userId}`);
}

export default {
    fetch,
    getUser,
    update,
    remove,
};

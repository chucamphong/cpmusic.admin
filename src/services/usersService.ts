import service from "./service";

function fetch(query: string) {
    return service.get(query);
}

function remove(userId: number) {
    return service.delete(`/users/${userId}`);
}

export default {
    fetch,
    remove,
};

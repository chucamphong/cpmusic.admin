import service from "./service";

function fetch(query: string) {
    return service.get(query);
}

export default {
    fetch,
};

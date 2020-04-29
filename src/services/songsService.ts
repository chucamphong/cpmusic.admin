import Query from "@chuphong/query-builder";
import service from "services/service";

const model = "songs";

export default {
    get(query: string | Query) {
        return service.get(query.toString());
    },
    remove(songId: number) {
        return service.delete(`/${model}/${songId}`);
    },
};

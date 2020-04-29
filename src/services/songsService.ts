import Query from "@chuphong/query-builder";
import service from "services/service";

export default {
    get(query: Query) {
        return service.get(query.toString());
    },
};

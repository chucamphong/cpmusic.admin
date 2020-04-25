import service from "services/service";
import buildQuery, { Query } from "utils/query-builder/query";

export default {
    get(query: Query) {
        return service.get(buildQuery(query));
    },
};

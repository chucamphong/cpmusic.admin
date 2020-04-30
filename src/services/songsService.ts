import Query from "@chuphong/query-builder";
import { Song } from "pages/Song/types";
import service from "services/service";

const model = "songs";

export default {
    get(query: string | Query) {
        return service.get(query.toString());
    },
    find(songId: number) {
        return service.get<Song>(`/${model}/${songId}`);
    },
    remove(songId: number) {
        return service.delete(`/${model}/${songId}`);
    },
};

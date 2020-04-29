import Query from "@chuphong/query-builder";
import { User } from "modules/Auth";
import service from "./service";

const model = "users";

export type UsersListResponse = {
    data: User[],
    links: {
        first: string,
        last: string | null,
        next: string | null,
        prev: string | null
    },
    meta: {
        current_page: number,
        from: number,
        last_page: number,
        path: string,
        per_page: number,
        to: number,
        total: number
    }
};

export default {
    /**
     * Lấy tất cả các dữ liệu trong bảng `users` phù hợp với `query`
     */
    get(query: Query | string) {
        return service.get<UsersListResponse>(query.toString());
    },
    find(userId: number) {
        return service.get<User>(`/${model}/${userId}`);
    },
    create(user: User & { password: string }) {
        return service.post(`/${model}`, user);
    },
    update(userId: number, data: Partial<User>) {
        return service.patch(`/${model}/${userId}`, data);
    },
    uploadAvatar(data: FormData) {
        return service.post(`/${model}/avatar`, data);
    },
    remove(userId: number) {
        return service.delete(`/${model}/${userId}`);
    },
};

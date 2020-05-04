import Query from "@chuphong/query-builder";
import { AxiosInstance } from "axios";
import http from "services/http";

export interface APIResponse {
    message: string;
    errors?: string[];
}

export interface APIPaginatedResponse<T extends Object> {
    data: T[],
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
}

export class Service<T extends Object> {
    protected model: string;
    protected http: AxiosInstance = http;

    constructor(model: string) {
        this.model = model;
    }

    protected url(...params: Parameters<any>) {
        return [
            this.model,
            params.join("/"),
        ].filter(Boolean).join("/");
    }

    public get(query: string | Query) {
        return this.http.get<APIPaginatedResponse<T>>(query.toString());
    }

    public find(entityId: number) {
        return this.http.get<T>(this.url(entityId));
    }

    public create(entity: Partial<T>) {
        return this.http.post<APIResponse>(this.url(), entity);
    }

    public update(entityId: number, data: Partial<T>) {
        return this.http.patch<APIResponse>(this.url(entityId), data);
    }

    public remove(entityId: number) {
        return this.http.delete<APIResponse>(this.url(entityId));
    }
}

export default http;

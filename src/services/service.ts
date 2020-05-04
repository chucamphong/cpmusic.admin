import Query from "@chuphong/query-builder";
import axios, { AxiosError, AxiosInstance, AxiosTransformer } from "axios";

const baseURL = "http://api.cpmusic.com/api";

function transformRequest(requestData: any, headers?: any): any {
    const plainTextToken = localStorage.getItem("plainTextToken");

    if (plainTextToken) {
        headers["Authorization"] = `Bearer ${plainTextToken}`;
    }

    return requestData;
}

// noinspection JSUnusedLocalSymbols
function transformResponse(responseData: any, headers?: any): any {
    if (responseData?.data && !responseData.meta) {
        return responseData.data;
    }

    return responseData;
}

const axiosInstance = axios.create({
    baseURL,
    responseType: "json",
    headers: {
        "X-Requested-With": "XMLHttpRequest",
    },
    transformRequest: [transformRequest, ...axios.defaults.transformRequest as AxiosTransformer[]],
    transformResponse: [transformResponse, ...axios.defaults.transformResponse as AxiosTransformer[]],
});

axiosInstance.interceptors.response.use(response => {
    return response;
}, (error: AxiosError) => {
    const statusCode = error.response?.status;

    if (statusCode === 401) {
        localStorage.removeItem("plainTextToken");
        window.location.reload();
    }

    return Promise.reject(error);
});

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
    protected http: AxiosInstance = axiosInstance;

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
        return this.http.post(this.url(), entity);
    }

    public update(entityId: number, data: Partial<T>) {
        return this.http.patch(this.url(entityId), data);
    }

    public remove(entityId: number) {
        return this.http.delete(this.url(entityId));
    }
}

export default axiosInstance;

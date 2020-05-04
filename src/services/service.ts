import axios, { AxiosError, AxiosTransformer } from "axios";

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

export default axiosInstance;

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

export default axiosInstance;

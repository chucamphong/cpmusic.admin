import axios, { AxiosTransformer } from "axios";

const baseURL = "http://api.cpmusic.com/api";

function transformRequest(requestData: any, headers?: any): any {
    const plainTextToken = localStorage.getItem("plainTextToken");

    if (plainTextToken) {
        headers["Authorization"] = `Bearer ${plainTextToken}`;
    }

    return requestData;
}

function transformResponse(responseData: any, headers?: any): any {
    if (responseData?.data) {
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

export const CancelToken = axios.CancelToken;
export default axiosInstance;

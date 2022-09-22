import axiosClient from "./axiosClient"

export const user_uudaiApi = {
    getAll: (params) => {
        const url = `/user_uudais`
        return axiosClient.get(url, { params });
    },
    post: data => {
        const url = '/user_uudais'
        return axiosClient.post(url, data);
    }
}
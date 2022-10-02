import axiosClient from "./axiosClient"

export const authApi = {
    forgetPassword: (data) => {
        const url = `/quenmatkhau`;
        return axiosClient.post(url, data);
    }
}
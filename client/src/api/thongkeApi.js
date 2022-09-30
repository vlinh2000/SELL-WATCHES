import axiosClient from "./axiosClient"

export const thongkeApi = {
    getAll: (params) => {
        return new Promise((resolve, reject) => {
            const url = `/thongkes`
            setTimeout(async () => {
                try {
                    const response = await axiosClient.get(url);
                    resolve(response);
                } catch (error) {
                    reject(error)
                }
            }, 500)
        })

    },
    get_my_orders: (params) => {
        const url = `/thongkes/my_orders`;
        return axiosClient.get(url);
    }
}
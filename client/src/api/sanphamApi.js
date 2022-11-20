import axiosClient from "./axiosClient"

export const sanphamApi = {
    getAll: (params) => {
        return new Promise((resolve, reject) => {
            const url = `/sanphams`
            setTimeout(async () => {
                try {
                    const response = await axiosClient.get(url, { params });
                    resolve(response);
                } catch (error) {
                    reject(error)
                }
            }, 200)
        })

    },
    get: (params) => {
        return new Promise((resolve, reject) => {
            const url = `/sanphams/${params}`
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
    post: data => {
        const url = '/sanphams';
        return axiosClient.post(url, data);
    },
    update: (params, data) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const url = `/sanphams/${params}`
                    const response = await axiosClient.patch(url, data);
                    resolve(response);

                } catch (error) {
                    reject(error)
                }
            }, 2000)
        })
    },
    delete: (params) => {
        const url = `/sanphams/${params}`
        return axiosClient.delete(url);
    }
}
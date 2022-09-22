import axiosClient from "./axiosClient"

export const donhangApi = {
    getAll: (params) => {
        return new Promise((resolve, reject) => {
            const url = `/donhangs`
            setTimeout(async () => {
                try {
                    const response = await axiosClient.get(url, { params });
                    resolve(response);
                } catch (error) {
                    reject(error)
                }
            }, 500)
        })

    },
    getThongKes: (params) => {
        return new Promise((resolve, reject) => {
            const url = `/donhangs/thongkes`
            setTimeout(async () => {
                try {
                    const response = await axiosClient.get(url, { params });
                    resolve(response);
                } catch (error) {
                    reject(error)
                }
            }, 500)
        })
    },
    post: data => {
        return new Promise((resolve, reject) => {
            const url = '/donhangs'
            setTimeout(async () => {
                try {
                    const response = await axiosClient.post(url, data);
                    resolve(response);

                } catch (error) {
                    reject(error)
                }
            }, 2000)


        })
    },
    update: (params, data) => {
        const url = `/donhangs/${params}`
        return axiosClient.patch(url, data);
    },
    delete: (params) => {
        const url = `/donhangs/${params}`
        return axiosClient.delete(url);
    }
}
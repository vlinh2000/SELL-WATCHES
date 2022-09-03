import axiosClient from "./axiosClient"

export const danhmucApi = {
    getAll: (params) => {
        return new Promise((resolve, reject) => {
            const url = `/danhmucs`
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
            const url = '/danhmucs'
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
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const url = `/danhmucs/${params}`
                    const response = await axiosClient.patch(url, data);
                    resolve(response);

                } catch (error) {
                    reject(error)
                }
            }, 2000)
        })
    },
    delete: (params) => {
        const url = `/danhmucs/${params}`
        return axiosClient.delete(url);
    }
}
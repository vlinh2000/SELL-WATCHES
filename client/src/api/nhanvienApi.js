import axiosClient from "./axiosClient"

export const nhanvienApi = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const url = `/nhanviens`
            setTimeout(async () => {
                try {
                    const response = await axiosClient.get(url);;
                    resolve(response);
                } catch (error) {
                    reject(error)
                }
            }, 2000)
        })

    },
    post: data => {
        return new Promise((resolve, reject) => {
            const url = '/nhanviens'
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
        const url = `/nhanviens/${params}`
        return axiosClient.patch(url, data);
    },
    delete: (params, data) => {
        const url = `/nhanviens/${params}`
        return axiosClient.delete(url, data);
    }
}
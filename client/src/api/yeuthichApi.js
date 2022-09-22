import axiosClient from "./axiosClient"

export const yeuthichApi = {
    getAll: (params) => {
        const url = `/yeuthichs`
        return axiosClient.get(url, { params });
    },
    post: data => {
        return new Promise((resolve, reject) => {
            const url = '/yeuthichs'
            setTimeout(async () => {
                try {
                    const response = await axiosClient.post(url, data);
                    resolve(response);

                } catch (error) {
                    reject(error)
                }
            }, 1000)


        })
    },
    delete: (params) => {
        const url = `/yeuthichs/${params}`
        return axiosClient.delete(url);
    }
}
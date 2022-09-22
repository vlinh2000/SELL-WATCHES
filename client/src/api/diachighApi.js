import axiosClient from "./axiosClient"

export const diachighApi = {
    getAll: (params) => {
        const url = `/diachighs`
        return axiosClient.get(url, { params });
    },
    post: data => {
        const url = '/diachighs'
        return axiosClient.post(url, data);
    },
    update: (params, data) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const url = `/diachighs/${params}`
                    const response = await axiosClient.patch(url, data);
                    resolve(response);

                } catch (error) {
                    reject(error)
                }
            }, 2000)
        })
    },
    delete: (params) => {
        const url = `/diachighs/${params}`
        return axiosClient.delete(url);
    }
}
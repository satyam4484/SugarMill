import axiosClient from "./apiClient"
import {apiEndpoints} from "./apiEndpoints"

export const customerRequest = {

    sendRequest: (data: any) => axiosClient().post(apiEndpoints.customer, JSON.stringify(data)),
    getCustomerRequests: () => axiosClient().get(apiEndpoints.customer)
}


export const userAuth = {
    loginUser: (data: any) => axiosClient().post(`${apiEndpoints.auth}/login`, JSON.stringify(data)),
}
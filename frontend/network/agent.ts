import axiosClient from "./apiClient"
import {apiEndpoints} from "./apiEndpoints"

export const customerRequest = {

    sendRequest: (data: any) => axiosClient().post(apiEndpoints.customer, JSON.stringify(data)),
    getCustomerRequests: () => axiosClient().get(apiEndpoints.customer)
}


export const userAuth = {
    loginUser: (data: any) => axiosClient().post(`${apiEndpoints.auth}/login`, JSON.stringify(data)),
}

export const contractors = {
    createContractor: (data: any) => axiosClient({"Content-Type": "multipart/form-data"}).post(`${apiEndpoints.contractor}`,data ),
    getAllContractors: (query?:any) => axiosClient().get(`${apiEndpoints.contractor}?${query}`),
}

export const documents = {
    validateDocuments: (data: any) => axiosClient().post(`${apiEndpoints.document}/validate`,data ),
}

export const userDetails = {
    validateEmailAndContact: (data: any) => axiosClient().post(`${apiEndpoints.user}/validate`,data ),
}
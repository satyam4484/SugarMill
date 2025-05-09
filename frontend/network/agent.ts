import axiosClient from "./apiClient"
import {apiEndpoints} from "./apiEndpoints"

export const customerRequest = {
    sendRequest: (data: any) => axiosClient().post(apiEndpoints.customer, JSON.stringify(data)),
    getCustomerRequests: () => axiosClient().get(apiEndpoints.customer)
}

export const ContractDetails = {
    getAvailableLabours: (data: any) =>  axiosClient().get(`${apiEndpoints.contract}/available-labourers/${data.contractorId}?startDate=${data.startDate}&endDate=${data.endDate}`),
    createContract: (data: any) => axiosClient({"Content-Type": "multipart/form-data"}).post(`${apiEndpoints.contract}`,data),
    getAllContract: (query?:any) => axiosClient().get(`${apiEndpoints.contract}?${query?query:''}`),
    UpdateContractDetils:(id: string,data: any) => axiosClient().put(`${apiEndpoints.contract}/${id}`,JSON.stringify(data)),
}

export const millOwnersApi = {
    getAllMillOwners : () => axiosClient().get(`${apiEndpoints.millOwner}`)
}


export const userAuth = {
    loginUser: (data: any) => axiosClient().post(`${apiEndpoints.auth}/login`, JSON.stringify(data)),
}

export const contractors = {
    createContractor: (data: any) => axiosClient({"Content-Type": "multipart/form-data"}).post(`${apiEndpoints.contractor}`,data ),
    getAllContractors: (query?:any) => axiosClient().get(`${apiEndpoints.contractor}?${query?query:''}`),
    getDashboardStatus:() => axiosClient().get(`${apiEndpoints.contractor}/dashboard-stats`)

}

export const labourers = {
    getAllLabours : (query?:any) => axiosClient().get(`${apiEndpoints.labourers}?${query?query:''}`),
    createLabourer: (data: any) => axiosClient({"Content-Type": "multipart/form-data"}).post(`${apiEndpoints.labourers}?folder=labourer`,data ),
    getLabourById:(id:string) => axiosClient().get(`${apiEndpoints.labourers}/${id}`),
    updateLabourer:(id: string,data: any) => axiosClient({"Content-Type": "multipart/form-data"}).put(`${apiEndpoints.labourers}/${id}`,data)
}

export const documents = {
    validateDocuments: (data: any) => axiosClient().post(`${apiEndpoints.document}/validate`,data ),
}

export const userDetails = {
    validateEmailAndContact: (data: any) => axiosClient().post(`${apiEndpoints.user}/validate`,data ),
}

export const vehiclesApi = {
    createVehicle: (data: any) => axiosClient().post(apiEndpoints.vehicles, JSON.stringify(data)),
    getAllVehicles: (query?: any) => axiosClient().get(`${apiEndpoints.vehicles}?${query ? query : ''}`),
    assignPermanently: (id: string) => axiosClient().put(`${apiEndpoints.vehicles}/${id}/permanent`),
    rentToMill: (id: string, data: any) => axiosClient().put(`${apiEndpoints.vehicles}/${id}/rent`, JSON.stringify(data)),
    endRental: (id: string) => axiosClient().put(`${apiEndpoints.vehicles}/${id}/end-rental`),
    getVehicleById: (id: string) => axiosClient().get(`${apiEndpoints.vehicles}/${id}`),
}
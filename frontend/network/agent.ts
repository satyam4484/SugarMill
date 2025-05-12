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

export const plansApi = {
    getAllPlans: () => axiosClient().get(apiEndpoints.plans),
    createPlan: (data: any) => axiosClient().post(apiEndpoints.plans, JSON.stringify(data)),
    updatePlan: (id: string, data: any) => axiosClient().put(`${apiEndpoints.plans}/${id}`, JSON.stringify(data)),
    deletePlan: (id: string) => axiosClient().delete(`${apiEndpoints.plans}/${id}`)
}

export const subscriptionsApi = {
    getAllSubscriptions: (query?: any) => axiosClient().get(`${apiEndpoints.subscriptions}?${query ? query : ''}`),
    getSubscriptionById: (id: string) => axiosClient().get(`${apiEndpoints.subscriptions}/${id}`),
    createSubscription: (data: any) => axiosClient().post(apiEndpoints.subscriptions, JSON.stringify(data)),
    updateSubscription: (id: string, data: any) => axiosClient().put(`${apiEndpoints.subscriptions}/${id}`, JSON.stringify(data)),
    cancelSubscription: (id: string) => axiosClient().put(`${apiEndpoints.subscriptions}/${id}/cancel`)
}

export const invoicesApi = {
    getAllInvoices: (query?: any) => axiosClient().get(`${apiEndpoints.invoices}?${query ? query : ''}`),
    getInvoiceById: (id: string) => axiosClient().get(`${apiEndpoints.invoices}/${id}`),
    createInvoice: (data: any) => axiosClient().post(apiEndpoints.invoices, JSON.stringify(data)),
    markAsPaid: (id: string, data: any) => axiosClient().put(`${apiEndpoints.invoices}/${id}/pay`, JSON.stringify(data)),
    downloadInvoice: (id: string) => axiosClient().get(`${apiEndpoints.invoices}/${id}/download`, { responseType: 'blob' })
}
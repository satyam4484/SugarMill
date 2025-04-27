import axios from "axios";

export const BASE_URL = "http://127.0.0.1:8000/api/";
import { AuthConstant } from "@/lib/contants";

const axiosClient = (options = {}) => {
    if (localStorage.getItem(AuthConstant.TOKEN_KEY)) {
        options = { Authorization: `Bearer ${localStorage.getItem(AuthConstant.TOKEN_KEY)}` ,...options};
    }
    console.log("option---",options)
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...options,
        },
    });
};

export default axiosClient;
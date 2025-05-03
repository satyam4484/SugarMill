import axios from "axios";
import { AuthConstant } from "@/lib/contants";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("BASE_URL",BASE_URL)

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
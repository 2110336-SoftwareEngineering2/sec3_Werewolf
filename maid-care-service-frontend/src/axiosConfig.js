import axios from "axios";
import {baseURL} from "./baseURL";

const auth = axios.create({
    baseURL: baseURL+ "/auth", // use proxy for baseURL
    headers: {'Content-Type':'application/json'}
})

export {auth}
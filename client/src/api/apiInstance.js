import axios from "axios"
 const api = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 100000,
    headers:{'Content-Type':"application/json"},
    withCredentials:true
 })

 api.interceptors.request.use((config)=>{
    return config
 },(error)=>{
    return Promise.reject(error)
 })

 api.interceptors.response.use((response)=> response,(error)=>{
    if(error.response?.status===401){
            window.location.href('/login')
    }
    return Promise.reject(error)
 })

 export default api
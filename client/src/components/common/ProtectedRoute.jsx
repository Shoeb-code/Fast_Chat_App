import { Navigate, useNavigate } from "react-router-dom"


export default function ProtectRoute({children}){
    const navigate =useNavigate()
    const token = localStorage.getItem("accessToken")

    if(!token){
       return navigate('/')
    }
    return children
}
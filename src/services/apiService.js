import axios from "axios";
import { toast } from "react-toastify";
 
const BaseURL = "http://localhost:5021";
var token = "";
 

export const setToken = (token) => {
    token = token;
}


 
export const PostData = async (endpoint, data) => {
    try{
        const response = await axios.post(`${BaseURL}/${endpoint}/`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data
    }
    catch (error){
        if (error.response.status === 401){
            toast.error("Please Login")
        }
        else{
            toast.error(error.response.message)
        }
    }
}
 
export const GetData = async (endpoint) => {
    try{
        const response = await axios.post(`${BaseURL}/${endpoint}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data
    }
    catch (error){
        toast.error(error.response.message)
    }
}
 
export const PostImageData = async (endpoint, data) => {
    try{
        const response = await axios.post(`${BaseURL}/${endpoint}/`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data
    }
    catch (error){
        if (error.response.status === 401){
            toast.error("Please Login")
        }
        else{
            toast.error(error.response.message)
        }
    }
}
 
export const PatchData = async (endpoint, data) => {
    try{
        const response = await axios.patch(`${BaseURL}/${endpoint}/`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data
    }
    catch (error){
        if (error.response.status === 401){
            toast.error("Please Login")
        }
        else{
            toast.error(error.response.message)
        }
    }
}
 
 
export const PatchImageData = async (endpoint, data) => {
    try{
        const response = await axios.patch(`${BaseURL}/${endpoint}/`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data
    }
    catch (error){
        if (error.response.status === 401){
            toast.error("Please Login")
        }
        else{
            toast.error(error.response.message)
        }
    }
}
 
export const DeleteData = async (endpoint) => {
    try{
        const response = await axios.delete(`${BaseURL}/${endpoint}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data
    }
    catch (error){
        if (error.response.status === 401){
            toast.error("Please Login")
        }
        else{
            toast.error(error.response.message)
        }
    }
}
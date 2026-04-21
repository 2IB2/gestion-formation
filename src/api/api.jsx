import axios from 'axios'

const API_URL = "http://localhost:8000/api"

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}

export function Get(table){
    return axios.get(`${API_URL}/${table}`, getAuthHeaders())
}

export function Post(table, data){
    return axios.post(`${API_URL}/${table}`, data, getAuthHeaders())
}

export function Put(table, data){
    return axios.put(`${API_URL}/${table}`, data, getAuthHeaders())
}

export function Delete(table, data = null){
    return axios.delete(`${API_URL}/${table}`, { ...getAuthHeaders(), data: data })
}

import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = {
        name, email, password
    }

    return axios.post(URL_API, data)
}

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = {
        email, password
    }

    return axios.post(URL_API, data)
}

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API)
}


const getProductsByCategoryApi = (category = 'all', page = 1, limit = 8) => {
    return axios.get(`/v1/api/products?category=${category}&page=${page}&limit=${limit}`);
}


const getBestSellersApi = (limit = 10) => {
    return axios.get(`/v1/api/products/best-sellers?limit=${limit}`);
}


const getMostViewedApi = (limit = 10) => {
    return axios.get(`/v1/api/products/most-viewed?limit=${limit}`);
}

export {
    createUserApi, loginApi, getUserApi,
    getProductsByCategoryApi, getBestSellersApi, getMostViewedApi,
}

import axios from "axios"

// const BASE_URL = 'http://localhost:4000'
// axios.defaults.baseURL = "http://localhost:4000/review"
// axios.defaults.withCredentials = true

export const addReview = async (review) => await axios.post('/review/addReview', review)
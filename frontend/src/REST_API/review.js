import axios from "axios"


export const addReview = async (review) => await axios.post('/review/addReview', review)
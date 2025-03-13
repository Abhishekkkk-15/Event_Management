import axios from "axios"

const BASE_URL = import.meta.env.VITE_REST_END_POINT
axios.defaults.baseURL = import.meta.env.VITE_REST_END_POINT
axios.defaults.withCredentials = true

export const ticketScanner = async(data)=> axios.post("/booking/validate-ticket",data)
export const ticketBooking = async(data)=> axios.post("/booking/booking-ticket",data)

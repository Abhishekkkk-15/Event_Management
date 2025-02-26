import axios from "axios"

const BASE_URL = 'http://localhost:4000'
axios.defaults.baseURL = "http://localhost:4000"
axios.defaults.withCredentials = true

export const ticketScanner = async(data)=> axios.post("/booking/validate-ticket",data)
export const ticketBooking = async(data)=> axios.post("/booking/booking-ticket",data)

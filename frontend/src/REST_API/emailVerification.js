import axios from "axios"

const BASE_URL = 'http://localhost:4000'
axios.defaults.baseURL = "http://localhost:4000/emailVerification"
axios.defaults.withCredentials = true

export const sendVerificationEmail = async () => await axios.get('/sendVerificationCode')
export const verifyCode = async (verificationCode) => await axios.post(`/verifiyCode/${verificationCode}`)
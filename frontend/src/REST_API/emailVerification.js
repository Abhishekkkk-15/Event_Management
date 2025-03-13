import axios from "axios"


export const sendVerificationEmail = async () => await axios.get('/emailVerification/sendVerificationCode')
export const verifyCode = async (verificationCode) => await axios.post(`/emailVerification/verifiyCode/${verificationCode}`)
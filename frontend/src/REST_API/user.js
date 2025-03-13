import axios from "axios";

export const forgetEmail = async(email) => await axios.post('/forgetPassword/forgetEmail',{
    email
})
export const resetPassword = async(data) => await axios.put('/forgetPassword/resetPassword',data)
export const logoutUser = async () => await axios.post("/user/logout");

export const updateUserProfile = async (data)=> await axios.put("/user/updateUser",data)

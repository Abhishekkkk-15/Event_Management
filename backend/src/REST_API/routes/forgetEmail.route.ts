import { Router } from "express";
import { forgetPassword, resetPassword } from "../controller/forgetPassword.controller";



const route = Router()  
route.post('/forgetEmail', forgetPassword )
route.put('/resetPassword', resetPassword)

export default route


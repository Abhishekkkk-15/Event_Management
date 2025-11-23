import { Router } from "express";
import { sendVerificationCode, verifiyEmail } from "../controller/emailVerification.controller";

const route = Router()

route.get('/sendVerificationCode',sendVerificationCode)
route.post('/verifiyCode/:verificationCode',verifiyEmail)

export default route
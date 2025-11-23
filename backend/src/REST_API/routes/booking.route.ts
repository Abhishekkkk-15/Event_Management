import { Router } from "express";
import { bookTicket, downloadTicket, verifyTicket } from "../controller/qr.controller";

const route = Router()

route.post('/booking-ticket', bookTicket)
route.get('/download-ticket',downloadTicket)
route.post('/validate-ticket',verifyTicket)

export default route
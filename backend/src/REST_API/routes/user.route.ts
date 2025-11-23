import { Router } from "express";
import { updateUser ,logout} from "../controller/user.controller";
import multer from "multer";




const route = Router()
const upload = multer({ dest: 'uploads/' })
route.post('/logout',logout)
route.put('/updateUser',upload.single('avatar'),updateUser)


export default route


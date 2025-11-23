import { Router } from "express";
import { createReview, getEventRating } from "../controller/review.controller";

const route = Router()

route.post('/addReview',createReview)
route.get('/getEventRating',getEventRating)

export default route
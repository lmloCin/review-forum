import forumRouter from "./ForumApi";
import MovieRouter from "./MovieApi";
import ReviewRouter from "./ReviewApi";
import { Router } from "express";

const endpointsRouter = Router()

endpointsRouter.use('/movies', MovieRouter)
endpointsRouter.use('/forums', forumRouter)
endpointsRouter.use('/reviews', ReviewRouter)



export default endpointsRouter
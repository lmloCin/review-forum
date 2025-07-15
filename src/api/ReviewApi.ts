import { Router, Request, Response } from "express";
import { ReviewService } from "../services/ReviewService";

const ReviewRouter = Router();

/**
 * @swagger
 * /api/reviews:
 *     post:
 *         summary: Create a new review
 *         requestBody:
 *             required: true
 *             content:
 *                 application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             text:
 *                                 type: string
 *                             rating:
 *                                 type: integer
 *                                 minimum: 1
 *                                 maximum: 5
 *                             movieId:
 *                                 type: integer
 *                         responses:
 *                             '201':
 *                                 description: Review created successfully
 *                             '400':
 *                                 description: Bad request (e.g., missing fields or invalid movie ID)
 */
ReviewRouter.post('/', async (request: Request, response: Response) => {
    try {
        const reviewDTO = request.body;
        const savedReview = await ReviewService.add(reviewDTO);
        response.status(201).json(savedReview);
    } catch (error: any) {
        response.status(400).json({ message: error.message });
    }
});

export default ReviewRouter;
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
 *         responses:
 *             '201':
 *                 description: Review created successfully
 *             '400':
 *                 description: Bad request (e.g., missing fields or invalid movie ID)
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

/**
 * @swagger
 * /api/reviews/{id}:
 *     put:
 *         summary: Update an existing review
 *         parameters:
 *             - name: id
 *               in: path
 *               description: Review ID to update
 *               required: true
 *               schema:
 *                   type: integer
 *         requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                   schema:
 *                       type: object
 *                       properties:
 *                           text:
 *                               type: string
 *                           rating:
 *                               type: integer
 *                               minimum: 1
 *                               maximum: 5
 *         responses:
 *             '200':
 *                 description: Review updated successfully
 *             '404':
 *                 description: Review not found
 */
ReviewRouter.put('/:id', async (request: Request, response: Response) => {
    try {
        const reviewId = Number(request.params.id);
        if (isNaN(reviewId)) {
            return response.status(400).json({ message: "ID inválido." });
        }

        const reviewDTO = request.body;
        const updatedReview = await ReviewService.update(reviewId, reviewDTO);

        response.status(200).json(updatedReview);
    } catch (error: any) {
        if (error.message.includes('não encontrada')) {
            response.status(404).json({ message: error.message });
        } else {
            response.status(400).json({ message: error.message });
        }
    }
});

/**
 * @swagger
 *      /api/reviews/{id}:
 *          delete:
 *              summary: Delete a review by its ID
 *              parameters:
 *              - name: id
 *                in: path
 *                description: Review ID to delete
 *                required: true
 *                schema:
 *                  type: integer
 *              responses:
 *                  '200':
 *                      description: Review deleted successfully
 *                  '404':
 *                      description: Review not found
 */
ReviewRouter.delete('/:id', async (request: Request, response: Response) => {
    try {
        const reviewId = Number(request.params.id);
        if (isNaN(reviewId)) {
            return response.status(400).json({ message: "ID inválido." });
        }

        await ReviewService.delete(reviewId);

        response.status(200).json({ message: "Review deletada com sucesso." });
    } catch (error: any) {
        if (error.message.includes('não encontrada')) {
            response.status(404).json({ message: error.message });
        } else {
            response.status(500).json({ message: "Erro interno do servidor." });
        }
    }
});


export default ReviewRouter;
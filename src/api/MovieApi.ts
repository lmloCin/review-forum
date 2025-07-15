import { Router, Request, Response } from "express";
import MovieServices from "../services/MovieServices";
const MovieRouter = Router();

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     responses:
 *       200:
 *         description: List of movies
 *   post:
 *     summary: Create a movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie created
 */
MovieRouter.get('/', async (request, response) => {
    const results = await MovieServices.getAll()
    response.send(results)
})

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               year:
 *                 type: integer
 *                 example: 2015
 *               director:
 *                 type: string
 *                 example: "George Miller"
 *               genre:
 *                 type: string
 *                 example: "Ação"
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       400:
 *         description: Bad request (e.g., missing fields)
 */
MovieRouter.post('/', async (request: Request, response: Response) => {
    try {
        const movieDTO = request.body;
        const persistedMovie = await MovieServices.add(movieDTO);
        response.status(201).json({ 
            message: `Filme '${persistedMovie.name}' cadastrado com sucesso.`,
            movie: persistedMovie 
        });
    } catch (error: any) {
        response.status(400).json({ message: error.message });
    }
})

/**
 * @swagger
 * /api/movies/get-by-id/{id}:
 *   get:
 *     summary: Get a movie by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Movie ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Desired movie
 *       404:
 *         description: No movie was founded with that ID
 */
MovieRouter.get('/get-by-id/:id', async (request: Request, response: Response) => {
    const id = request.params['id']
    const result = await MovieServices.getById(Number(id))
    response.send(JSON.stringify(result))
})

/**
 * @swagger
 * /api/movies/{id}:
 *     put:
 *         summary: Update an existing movie
 *         parameters:
 *             - name: id
 *               in: path
 *               description: Movie ID to update
 *               required: true
 *               schema:
 *                   type: integer
 *         requestBody:
 *             required: true
 *             content:
 *                 application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             name:
 *                                 type: string
 *                             description:
 *                                 type: string
 *                             year:
 *                                 type: integer
 *                             director:
 *                                 type: string
 *                             genre:
 *                                 type: string
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Movie not found
 */
MovieRouter.put('/:id', async (request: Request, response: Response) => {
    try {
        const movieId = Number(request.params.id);
        if (isNaN(movieId)) {
            return response.status(400).json({ message: "ID inválido." });
        }

        const movieDTO = request.body;
        const updatedMovie = await MovieServices.update(movieId, movieDTO);

        response.status(200).json({
            message: `Informações do filme '${updatedMovie.name}' atualizadas com sucesso.`,
            movie: updatedMovie
        });
    } catch (error: any) {
        if (error.message.includes('não encontrado')) {
            response.status(404).json({ message: error.message });
        } else {
            response.status(400).json({ message: error.message });
        }
    }
});


/**
 * @swagger
 * /api/movies/details/{id}:
 *   get:
 *     summary: Get movie details including reviews and average rating
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Movie ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie details with reviews and availability
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 averageRating:
 *                   type: number
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                 availability:
 *                   type: object
 *                   properties:
 *                     streaming:
 *                       type: array
 *                       items:
 *                         type: string
 *                     rent:
 *                       type: array
 *                       items:
 *                         type: string
 *                     purchase:
 *                       type: array
 *                       items:
 *                         type: string
 *       404:
 *         description: Movie not found
 */
MovieRouter.get('/details/:id', async (request: Request, response: Response) => {
    try {
        const movieId = Number(request.params.id);
        if (isNaN(movieId)) {
            return response.status(400).send({ message: "ID inválido." });
        }

        const result = await MovieServices.getMovieDetails(movieId);

        if (result) {
            response.status(200).json(result);
        } else {
            response.status(404).send({ message: "Filme não encontrado." });
        }
    } catch (error) {
        console.error(error);
        response.status(500).send({ message: "Erro interno do servidor." });
    }
});


/**
 * @swagger
 * /api/movies/{id}:
 *     delete:
 *       summary: Delete a movie by its ID
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Movie ID to delete
 *           required: true
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: Movie and its reviews deleted successfully
 *         '404':
 *           description: Movie not found
 */
MovieRouter.delete('/:id', async (request: Request, response: Response) => {
    try {
        const movieId = Number(request.params.id);
        if (isNaN(movieId)) {
            return response.status(400).json({ message: "ID inválido." });
        }

        await MovieServices.delete(movieId);

        response.status(200).json({ message: "Filme e todas as suas reviews foram deletados com sucesso." });
    } catch (error: any) {
        if (error.message.includes('não encontrado')) {
            response.status(404).json({ message: error.message });
        } else {
            response.status(500).json({ message: "Erro interno do servidor." });
        }
    }
});


/**
 * @swagger
 * /api/movies/search:
 *   get:
 *     summary: Search movies by title
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Search movies from their title
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of movies with likely titles
 *       404:
 *         description: No movie was founded with that title
 */
MovieRouter.get('/search', async(request: Request, response: Response) => {
    const params = request.query;
    // @ts-ignore
    const result = await MovieServices.searchByName(params.name);
    response.send(result);
})

export default MovieRouter;
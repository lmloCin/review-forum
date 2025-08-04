import { Router, Request, Response } from "express";
import MovieServices from "../services/MovieServices";
const MovieRouter = Router();

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     tags: [movies]
 *     responses:
 *       200:
 *         description: List of movies
 *   post:
 *     summary: Create a movie
 *     tags: [movies]
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
 *               tags:
 *                 type: array
 *                 items:
 *                     type: string
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

/**
 * @swagger
 * /api/movies/trending:
 *   get:
 *     summary: Get the top 10 movies by reviews_today
 *     responses:
 *       200:
 *         description: List of movies
 */
//api/movies/trending/
MovieRouter.get('/trending', async (req: Request,res: Response)=>{
    const movies = await MovieServices.trending();
    res.status(200).json(movies);

})

/**
 * @swagger
 * /api/movies/search-by-tags:
 *   get:
 *     summary: Search movies by exact tag match
 *     description: Returns movies that contain all the specified tags.
 *     parameters:
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: List of movies matching the given tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '##/models/Movie'
 *       400:
 *         description: Missing or invalid tags parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing or invalid tags parameter
 */


//api/movies/search-by-tags?tags=
MovieRouter.get('/search-by-tags', async (req: Request, res: Response) => {
    const tagsParam = req.query.tags;
    if (!tagsParam || typeof tagsParam !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid tags parameter' });
    }
    const tags = tagsParam.split(',').map(n=> n.toLowerCase());
    const movies = await MovieServices.searchByTags(tags);
    res.status(200).json(movies);
});

/**
 * @swagger
 * /api/movies/by-rating:
 *   get:
 *     summary: Get movies filtered by rating range
 *     description: Returns all movies with rating between min and max. If no params are provided, returns all movies.
 *     parameters:
 *       - in: query
 *         name: min
 *         schema:
 *           type: number
 *         required: false
 *       - in: query
 *         name: max
 *         schema:
 *           type: number
 *         required: false
 *     responses:
 *       200:
 *         description: List of movies filtered by rating
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '##/models/Movie'
 */
//api/movies/by-rating?min=&max=

MovieRouter.get('/by-rating', async (req: Request, res: Response) => {
    const min = parseFloat(req.query.min as string);
    const max = parseFloat(req.query.max as string);

    if (isNaN(min) && isNaN(max)) {
        const movies = await MovieServices.getAll();
        res.status(200).json(movies);
    }

    if (isNaN(min)) {
        const movies = await MovieServices.getByRating(0, max);
        res.status(200).json(movies);
    }
    if (isNaN(max)){
        const movies = await MovieServices.getByRating(min, 5);
        res.status(200).json(movies);
    }

    // 400:
    //         description: Invalid parameters
    //return res.status(400).json({ error: 'Invalid or missing min/max values' });
    const movies = await MovieServices.getByRating(min, max);
    res.status(200).json(movies);
});



export default MovieRouter;
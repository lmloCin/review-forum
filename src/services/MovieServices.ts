import { Movie } from "../models/Movie"
import MovieRepository from "../repository/MovieRepository"
import { Review } from '../models/Review';
import ReviewRepository from "../repository/ReviewRepository";


export default class MovieServices {

    static async getAll() {
        return MovieRepository.getAll()
    }

    static async add(movieDTO: any) {
        this.validate(movieDTO) 
        const movieToAdd = new Movie(
            movieDTO.name, 
            movieDTO.description,
            movieDTO.year,
            movieDTO.director,
            movieDTO.genre,
            movieDTO.availability 
        );
        return MovieRepository.saveMovie(movieToAdd)
    }

    static async getById(id: number) : Promise<Movie | null> {
        return MovieRepository.getById(id)
    }

    public static async getMovieDetails(movieId: number): Promise<{
        id: number;
        name: string;
        description: string;
        averageRating: number;
        reviews: Review[];
        availability?: { streaming?: string[]; rent?: string[]; purchase?: string[] };
    } | null> {
        const movieWithReviews = await MovieRepository.findByIdWithReviews(movieId);
        
        if (!movieWithReviews) {
            return null;
        }

        const { reviews } = movieWithReviews;
        let averageRating = 0;
        if (reviews && reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            averageRating = totalRating / reviews.length;
        }

        const movieDetails = {
            id: movieWithReviews.id,
            name: movieWithReviews.name,
            description: movieWithReviews.description,
            averageRating: parseFloat(averageRating.toFixed(1)),
            reviews: reviews || [],
            availability: movieWithReviews.availability
        };

        return movieDetails;
    }

    static async searchByName(name: string) {
        return MovieRepository.searchByName(name)
    }

    static async update(id: number, movieUpdateDTO: any) {
        const movieToUpdate = await MovieRepository.getById(id);

        if (!movieToUpdate) {
            throw new Error('Filme não encontrado com esse id');
        }

        Object.assign(movieToUpdate, movieUpdateDTO);

        return MovieRepository.saveMovie(movieToUpdate);
    }


    private static validate(movieDTO: any) {
        if (!movieDTO.name) {
            throw new Error('O nome do filme é requerido')
        }
    }

        static async delete(movieId: number): Promise<void> {
        // Passo 1: Busca a entidade completa do filme, INCLUINDO as reviews.
        const movieToDelete = await MovieRepository.findByIdWithReviews(movieId);
        
        // Passo 2: Verifica se o filme existe.
        if (!movieToDelete) {
            throw new Error(`Filme com ID ${movieId} não encontrado.`);
        }

        // Passo 3: Se o filme tiver reviews, itera sobre elas e deleta cada uma.
        // Usar um loop for...of com await é mais seguro do que Promise.all para
        // garantir que cada operação termine antes da próxima.
        if (movieToDelete.reviews && movieToDelete.reviews.length > 0) {
            for (const review of movieToDelete.reviews) {
                await ReviewRepository.deleteById(review.id);
            }
        }

        // Passo 4: Após as reviews serem removidas, remove o filme.
        await MovieRepository.remove(movieToDelete);
    }
}



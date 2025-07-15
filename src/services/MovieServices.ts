import { Movie } from "../models/Movie"
import MovieRepository from "../repository/MovieRepository"
import { Review } from '../models/Review';


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

    // Novo método para a feature de detalhes do filme
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
        // Busca o filme existente no banco de dados.
        const movieToUpdate = await MovieRepository.getById(id);

        if (!movieToUpdate) {
            throw new Error('Filme não encontrado com esse id');
        }

        // Atualiza o objeto do filme com os novos dados do DTO.
        // O Object.assign copia apenas as propriedades do DTO para o objeto existente.
        Object.assign(movieToUpdate, movieUpdateDTO);

        // Salva a entidade atualizada de volta no banco.
        return MovieRepository.saveMovie(movieToUpdate);
    }


    private static validate(movieDTO: any) {
        if (!movieDTO.name) {
            throw new Error('O nome do filme é requerido')
        }
    }
}

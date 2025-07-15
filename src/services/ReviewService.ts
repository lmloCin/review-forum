import { Review } from "../models/Review";
import ReviewRepository from "../repository/ReviewRepository";
import MovieRepository from "../repository/MovieRepository";


interface ReviewDTO {
    text: string;
    rating: number;
    movieId: number;
}



export class ReviewService {
    static async add(reviewDTO: ReviewDTO): Promise<Review> {
        // Validação dos dados recebidos
        if (!reviewDTO.text || !reviewDTO.rating || !reviewDTO.movieId) {
            throw new Error("Todos os campos (text, rating, movieId) são obrigatórios.");
        }
        if (reviewDTO.rating < 1 || reviewDTO.rating > 5) {
            throw new Error("A nota (rating) deve ser entre 1 e 5.");
        }

        // Verifica se o filme associado existe
        const movieExists = await MovieRepository.getById(reviewDTO.movieId);
        if (!movieExists) {
            throw new Error(`Filme com ID ${reviewDTO.movieId} não encontrado.`);
        }

        // Cria uma nova instância da entidade Review
        const newReview = new Review();
        newReview.text = reviewDTO.text;
        newReview.rating = reviewDTO.rating;
        newReview.movie = movieExists; // Associa a entidade do filme

        // Salva a nova review no banco de dados
        return ReviewRepository.saveReview(newReview);
    }
}

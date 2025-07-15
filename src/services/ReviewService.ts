import { Review } from "../models/Review";
import ReviewRepository from "../repository/ReviewRepository";
import MovieRepository from "../repository/MovieRepository";


interface ReviewDTO {
    text: string;
    rating: number;
    movieId: number;
}

interface ReviewUpdateDTO {
    text?: string;
    rating?: number;
}

export class ReviewService {
    static async add(reviewDTO: ReviewDTO): Promise<Review> {
        if (!reviewDTO.text || !reviewDTO.rating || !reviewDTO.movieId) {
            throw new Error("Todos os campos (text, rating, movieId) são obrigatórios.");
        }
        if (reviewDTO.rating < 1 || reviewDTO.rating > 5) {
            throw new Error("A nota (rating) deve ser entre 1 e 5.");
        }

        const movieExists = await MovieRepository.getById(reviewDTO.movieId);
        if (!movieExists) {
            throw new Error(`Filme com ID ${reviewDTO.movieId} não encontrado.`);
        }

        const newReview = new Review();
        newReview.text = reviewDTO.text;
        newReview.rating = reviewDTO.rating;
        newReview.movie = movieExists; 


        return ReviewRepository.saveReview(newReview);
    }

        static async update(reviewId: number, reviewUpdateDTO: ReviewUpdateDTO): Promise<Review> {

        const reviewToUpdate = await ReviewRepository.findById(reviewId);
        if (!reviewToUpdate) {
            throw new Error(`Review com ID ${reviewId} não encontrada.`);
        }

        if (reviewUpdateDTO.text) {
            reviewToUpdate.text = reviewUpdateDTO.text;
        }
        if (reviewUpdateDTO.rating) {
            if (reviewUpdateDTO.rating < 1 || reviewUpdateDTO.rating > 5) {
                throw new Error("A nota (rating) deve ser entre 1 e 5.");
            }
            reviewToUpdate.rating = reviewUpdateDTO.rating;
        }

        reviewToUpdate.isEdited = true;

        return ReviewRepository.saveReview(reviewToUpdate);
    }

    static async delete(reviewId: number): Promise<void> {

        const reviewToDelete = await ReviewRepository.findById(reviewId);
        if (!reviewToDelete) {
            throw new Error(`Review com ID ${reviewId} não encontrada.`);
        }


        await ReviewRepository.deleteById(reviewId);
    }

}

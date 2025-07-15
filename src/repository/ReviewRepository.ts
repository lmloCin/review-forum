import { AppDataSource } from "../infra/setup_db";
import { Review } from "../models/Review";

const reviewRepository = AppDataSource.getRepository(Review);

export default class ReviewRepository {
    static saveReview(review: Review): Promise<Review> {
        return reviewRepository.save(review);
    }
}
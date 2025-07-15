import { AppDataSource } from "../infra/setup_db";
import { Movie } from "../models/Movie";
const movieRepository = AppDataSource.getRepository(Movie)


export default class MovieRepository {

    static getAll() : Promise<Movie[]> {
        return movieRepository.find()
    }

    static getById(id: number) : Promise<Movie | null> {
        return movieRepository.findOne({
            where: {
                id: id
            }
        })
    }

    // Novo método para buscar um filme junto com suas reviews
    static findByIdWithReviews(id: number): Promise<Movie | null> {
        return movieRepository.findOne({
            where: { id: id },
            relations: {
                reviews: true, // Isso instrui o TypeORM a carregar as reviews relacionadas.
            },
        });
    }

    static searchByName(name: string) : Promise<Movie[]> {
        return movieRepository.createQueryBuilder("movie").where(`movie.name LIKE '%${name}%'`).getMany()
    }

    static saveMovie(movie: Movie) : Promise<any> {
        return movieRepository.save(movie)
    }
}
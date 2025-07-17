import { AppDataSource } from "./setup_db";
import { Review } from "../models/Review";
import { Movie } from "../models/Movie";
import { Forum } from "../models/Forum";
import Comment from "../models/Comment";

async function cleanupDatabase() {
    try {

        await AppDataSource.initialize();
        console.log("Conexão com o banco de dados estabelecida para limpeza...");

        const commentRepository = AppDataSource.getRepository(Comment);
        const reviewRepository = AppDataSource.getRepository(Review);
        const forumRepository = AppDataSource.getRepository(Forum);
        const movieRepository = AppDataSource.getRepository(Movie);

        console.log("Limpando a tabela de Comentários...");
        await commentRepository.createQueryBuilder().delete().from(Comment).execute();

        console.log("Limpando a tabela de Reviews...");
        await reviewRepository.createQueryBuilder().delete().from(Review).execute();
        
        console.log("Limpando a tabela de Fóruns...");
        await forumRepository.createQueryBuilder().delete().from(Forum).execute();

        console.log("Limpando a tabela de Filmes...");
        await movieRepository.createQueryBuilder().delete().from(Movie).execute();


        console.log("Banco de dados limpo com sucesso!");

    } catch (error) {
        console.error("Erro ao limpar o banco de dados:", error);
    } finally {

        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log("Conexão com o banco de dados fechada.");
        }
    }
}


cleanupDatabase();
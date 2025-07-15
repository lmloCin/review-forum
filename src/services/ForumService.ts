import { Forum } from "../models/Forum"
import ForumRepository from "../repository/ForumRepository"
import MovieServices from "./MovieServices"

export default class ForumService {

    private static instance: ForumService;

    private constructor() {}

    static getInstance(): ForumService {
        if (!ForumService.instance) {
        ForumService.instance = new ForumService();
        }
        return ForumService.instance;
    }
    
    getById(id: Number): Promise<Forum | null> {
        return ForumRepository.getInstance().getById(id)
    }
    getAll(): Promise<Forum[]> {
        return ForumRepository.getInstance().getAll()
    }
    searchByTitle(title: string): Promise<Forum[]> {
        return ForumRepository.getInstance().searchByTitle(title)
    }
    searchByCreatorUser(username: string): Promise<Forum[]> {
        return ForumRepository.getInstance().searchByCreatorUser(username)
    }

    async updateForum(forum: Forum): Promise<any> {
        const existingForum = await ForumRepository.getInstance().getById(forum.id);
        if (!existingForum) {
            throw new Error('Forum not found');
        }

        existingForum.title = forum.title;
        existingForum.description = forum.description || '';
        return ForumRepository.getInstance().saveForum(existingForum);
    }
    
    async saveForum(forum: any): Promise<any> {
        const relatedMovie= await MovieServices.getById(forum.movieId)
        
        if (!relatedMovie) {
            throw Error('Filme relacionado não encontrado')
        }

        if (!forum.title) {
            throw new Error('O títutlo do forum é requerido')
        }

        return ForumRepository.getInstance().saveForum(new Forum(forum.title, forum.description, forum.username, relatedMovie))
    }

}
import { UpdateResult } from "typeorm";
import { AppDataSource } from "../infra/setup_db";
import { Forum } from "../models/Forum";

export default class ForumRepository {
  
  static forumRepo = AppDataSource.getRepository(Forum);

  static getAll(): Promise<Forum[]> {
    return this.forumRepo.find(
      {
        relations: ["related_movie"],
        order: {
          updated_at: 'DESC'
        }
      }
    );
  }

  static getById(id: Number): Promise<Forum | null> {
    return this.forumRepo.findOne({
      where: { id },
      relations: ["related_movie"]
    });
  }

  static searchByTitle(title: string): Promise<Forum[]> {
    return this.forumRepo
      .createQueryBuilder("forum")
      .leftJoinAndSelect("forum.related_movie", "movie")
      .where("forum.title LIKE :title", { title: `%${title}%` })
      .orderBy("forum.updated_at", "DESC")
      .getMany();
  }

  static searchByCreatorUser(username: string): Promise<Forum[]> {
    return this.forumRepo.find({
      where: { username },
      relations: ["related_movie"]
    });
  }

  static saveForum(forum: Forum): Promise<Forum> {
    return this.forumRepo.save(forum);
  }
}

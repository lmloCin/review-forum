import "reflect-metadata";
import { DataSource } from "typeorm";
import { Movie } from "../models/Movie";
import { Forum } from "../models/Forum";
import Comment from "../models/Comment";
import { Review } from "../models/Review";
import {MovieReviewStats} from "../models/MovieReviewStats";


export const AppDataSource = new DataSource({
  type: "postgres",
  host: "127.0.0.1",
  port: 5432,
  username: "postgres",
  password: "asd",
  database: "review_forum",
  synchronize: true,
  entities: [Movie, Review, Forum, Comment,MovieReviewStats],
});

import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
    expression: `
    SELECT
      m.id,
      m.name,
      ROUND(AVG(r.rating), 2) AS average_rating,
      COUNT(r.id) FILTER (WHERE r.created_at::date = CURRENT_DATE) AS reviews_today
    FROM movie m
    LEFT JOIN review r ON r.movie_Id = m.id
    GROUP BY m.id
  `
})
export class MovieReviewStats {
    @ViewColumn()
    id!: number;

    @ViewColumn()
    name!: string;

    @ViewColumn()
    average_rating!: number;

    @ViewColumn()
    reviews_today!: number;
}
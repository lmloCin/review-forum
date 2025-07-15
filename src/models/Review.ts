import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Movie } from './Movie';
/**
 * src/models/Review.ts (Novo arquivo de entidade)
 * Define a entidade Review e sua relação com Movie.
 */
@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    text!: string;

    @Column('int')
    rating!: number;

    // Relacionamento: Muitas reviews pertencem a um filme.
    @ManyToOne(() => Movie, movie => movie.reviews)
    movie!: Movie;
    
    @CreateDateColumn()
    created_at!: Date;
}
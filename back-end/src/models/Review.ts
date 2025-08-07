import { JoinColumn,Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Movie } from './Movie';


@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    text!: string;

    @Column('int')
    rating!: number;

    @UpdateDateColumn()
    updated_at!: Date;

    @Column({ default: false })
    isEdited!: boolean;

    @ManyToOne(() => Movie, movie => movie.reviews)
    @JoinColumn({ name: 'movie_id' })
    movie!: Movie;
    
    @CreateDateColumn()
    created_at!: Date;
}
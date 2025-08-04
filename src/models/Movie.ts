import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn} from 'typeorm'
import { Review } from './Review';

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string;

    @Column()
    description!: string;

    @Column({ type: 'int', nullable: true })
    year!: number;

    @Column({ nullable: true })
    director!: string;

    @Column("text", { array: true, nullable: true })
    tags?: string[];
    
    @Column({ type: 'simple-json', nullable: true })
    availability?: {
        streaming?: string[];
        rent?: string[];
        purchase?: string[];
    };

    @CreateDateColumn()
    created_at!: Date;

    @Column({nullable: true})
    rating?: number

    @OneToMany(() => Review, review => review.movie, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    reviews!: Review[];

    constructor(name: string, description: string, year: number, director: string, tags: string[], availability?: any) {
        this.name = name;
        this.description = description;
        this.year = year;
        this.director = director;
        this.tags = tags?.map(n=>n.toLowerCase());
        this.availability = availability;
    }
}

import React, { useRef, useEffect } from 'react'; // Importamos useRef e useEffect
import type { Movie } from '../types/movie';
import MovieCard from './MovieCard';
import styles from './MovieRow.module.css';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        element.scrollTo({
          left: element.scrollLeft + e.deltaY,
          behavior: 'smooth'
        });
      };
      element.addEventListener('wheel', onWheel);
      return () => element.removeEventListener('wheel', onWheel);
    }
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <div ref={scrollRef} className={`${styles.row} scrollbar-hide`}>
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default MovieRow;
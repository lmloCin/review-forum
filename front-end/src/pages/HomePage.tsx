import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import type { Movie } from '../types/movie';
import MovieRow from '../components/MovieRow';
import styles from './HomePage.module.css';

function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        // Buscamos os filmes populares e os filmes gerais em paralelo
        const [trendingResponse, recentResponse] = await Promise.all([
            apiClient.get<Movie[]>('/movies/trending'),
            apiClient.get<Movie[]>('/movies') // Endpoint para os filmes mais recentes
        ]);
        
        setTrendingMovies(trendingResponse.data);
        setRecentMovies(recentResponse.data);
        
      } catch (err) {
        setError("Não foi possível carregar os filmes.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllMovies();
  }, []);

  if (loading) return <p className={styles.loading}>A carregar...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <MovieRow title="Filmes Populares" movies={trendingMovies} />
      <MovieRow title="Novos Lançamentos" movies={recentMovies} />
    </div>
  );
}

export default HomePage;


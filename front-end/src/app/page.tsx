"use client";

import { useState, useEffect } from 'react';
import apiClient from '@/services/api';
import type { Movie } from '@/types/movie';
import MovieRow from '@/components/MovieRow';
import styles from './page.module.css'; 
import { useAuth } from '@/context/AuthContext'; 
import Link from 'next/link'; 


function HomePage() {
  const { isAdmin } = useAuth();
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const [trendingResponse, recentResponse] = await Promise.all([
            apiClient.get<Movie[]>('/movies/trending'),
            apiClient.get<Movie[]>('/movies')
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
      <div className={styles.pageHeader}>
        <h1 className={styles.mainTitle}>Filmes</h1>
        {/* O botão agora aponta para a nova rota /add-movie */}
        {isAdmin && (
          <Link href="/add-movie" className={styles.addButton}>
            + Adicionar Filme
          </Link>
        )}
      </div>
      <MovieRow title="Filmes Populares" movies={trendingMovies} />
      <MovieRow title="Novos Lançamentos" movies={recentMovies} />
    </div>
  );
}

export default HomePage;
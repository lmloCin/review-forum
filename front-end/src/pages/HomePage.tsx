// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import apiClient from '../services/api'; // Importa nosso serviço de API
import type { Movie } from '../types/movie'; // Importa nosso tipo

function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]); // Tipando o estado
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // A resposta do Axios será inferida, mas podemos ser explícitos
        const response = await apiClient.get<Movie[]>('/movies');
        setMovies(response.data);
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []); // O array vazio garante que isso rode apenas uma vez

  if (loading) {
    return <p>Carregando filmes...</p>;
  }

  return (
    <div>
      <h1>Catálogo de Filmes</h1>
      <ul>
        {movies.map((movie: Movie) => (
          <li key={movie.id}>{movie.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;

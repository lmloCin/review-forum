"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import apiClient from '@/services/api';
import type { Movie } from '@/types/movie';
import styles from './page.module.css'; 

function AddReviewPage() {
  const params = useParams();
  const router = useRouter(); 
  const [movie, setMovie] = useState<Movie | null>(null);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  
  const id = params?.id;

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await apiClient.get<Movie>(`/movies/get-by-id/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error("Erro ao buscar filme:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
        fetchMovie();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
        alert('Por favor, selecione uma nota.');
        return;
    }
    try {
      await apiClient.post('/reviews', {
        text,
        rating,
        movieId: Number(id)
      });
      alert('Review enviada com sucesso!');
      router.push(`/movie/${id}`); 
    } catch (error) {
      console.error("Erro ao enviar a review:", error);
      alert('Falha ao enviar a review.');
    }
  };

  if (loading) return <p>A carregar...</p>;
  if (!movie) return <p>Filme não encontrado.</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Adicionar sua Review para:</h1>
      <p className={styles.movieTitle}>{movie.name}</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Sua Nota (obrigatório)*</label>
          <div className={styles.starRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`${styles.star} ${rating >= star ? styles.starActive : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="text" className={styles.label}>Sua Review (opcional)</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={styles.textarea}
            placeholder="Fotografia belíssima e uma história tocante!"
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" onClick={() => router.push(`/movie/${id}`)} className={`${styles.button} ${styles.cancelButton}`}>
            Cancelar
          </button>
          <button type="submit" className={`${styles.button} ${styles.saveButton}`}>
            Enviar Review
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddReviewPage;

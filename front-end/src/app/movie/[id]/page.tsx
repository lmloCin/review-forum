"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import Link from 'next/link'; 
import apiClient from '@/services/api';
import type { Movie, Review, Availability } from '@/types/movie';
import styles from './page.module.css'; 
import { useAuth } from '@/context/AuthContext';

function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tags' | 'available'>('tags');
  
  const id = params?.id;

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const [detailsResponse, baseInfoResponse] = await Promise.all([
          apiClient.get<Movie>(`/movies/details/${id}`),
          apiClient.get<Movie>(`/movies/get-by-id/${id}`)
        ]);
        const combinedMovieData: Movie = {
          ...baseInfoResponse.data,
          ...detailsResponse.data,
        };
        setMovie(combinedMovieData);
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Tem a certeza que deseja apagar o filme "${movie?.name}"?`)) {
      try {
        await apiClient.delete(`/movies/${id}`);
        alert('Filme apagado com sucesso!');
        router.push('/');
      } catch (error) {
        console.error("Erro ao apagar o filme:", error);
        alert('Falha ao apagar o filme.');
      }
    }
  };

  const renderAvailability = (availability: Availability | null | undefined) => {
      if (!availability) return <p>Informação de disponibilidade não encontrada.</p>;
      const hasStreaming = availability.streaming && availability.streaming.length > 0;
      const hasRent = availability.rent && availability.rent.length > 0;
      const hasPurchase = availability.purchase && availability.purchase.length > 0;

      if (!hasStreaming && !hasRent && !hasPurchase) {
          return <p>Não está disponível em nenhuma plataforma.</p>
      }

      return (
          <div className={styles.availabilityGrid}>
              {hasStreaming && <div><h3>Streaming</h3><ul>{availability.streaming?.map(s => <li key={s}>{s}</li>)}</ul></div>}
              {hasRent && <div><h3>Alugar</h3><ul>{availability.rent?.map(r => <li key={r}>{r}</li>)}</ul></div>}
              {hasPurchase && <div><h3>Comprar</h3><ul>{availability.purchase?.map(p => <li key={p}>{p}</li>)}</ul></div>}
          </div>
      )
  }

  if (loading) return <p className={styles.loading}>A carregar...</p>;
  if (!movie) return <p className={styles.error}>Filme não encontrado.</p>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <section className={styles.posterSection}>
          <img 
            src={movie.bannerURL || `https://placehold.co/280x420/14181C/ffffff?text=${movie.name}`} 
            alt={`Poster de ${movie.name}`} 
            className={styles.poster}
            referrerPolicy="no-referrer"
          />
        </section>
        <section className={styles.detailsSection}>
          <div className={styles.titleHeader}>
            <h1 className={styles.title}>{movie.name}</h1>
            <span className={styles.year}>{movie.year}</span>
          </div>
          <p className={styles.director}>
            Directed by <a href="#">{movie.director || 'N/A'}</a>
          </p>
          <p className={styles.description}>
            {movie.description || 'No description available.'}
          </p>
          <div className={styles.ratings}>
            <h3 className={styles.ratingsTitle}>RATINGS</h3>
            <p className="text-2xl font-bold text-white">{movie.averageRating?.toFixed(1) || 'N/A'}</p>
          </div>
          <div className={styles.actions}>
            {isAdmin ? (
              <div className={styles.adminControls}>
                <Link href={`/movie/${movie.id}/edit`} className={styles.adminButton}>
                  Edit Movie
                </Link>
                <button onClick={handleDelete} className={`${styles.adminButton} ${styles.deleteButton}`}>
                  Delete Movie
                </button>
              </div>
            ) : (
              <p>Sign in to log, rate or review</p>
            )}
          </div>
          
          {}
          <div className={styles.infoSection}>
            <div className={styles.infoNav}>
                <button onClick={() => setActiveTab('tags')} className={activeTab === 'tags' ? styles.activeTab : ''}>Tags</button>
                <button onClick={() => setActiveTab('available')} className={activeTab === 'available' ? styles.activeTab : ''}>Available On</button>
            </div>
            <div className={styles.infoContent}>
                {activeTab === 'tags' && (
                    <div className={styles.tagsContainer}>
                        {movie.tags && movie.tags.length > 0 ? (
                            movie.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)
                        ) : (
                            <p>No tags available.</p>
                        )}
                    </div>
                )}
                {activeTab === 'available' && (
                    <div>
                        {renderAvailability(movie.availability)}
                    </div>
                )}
            </div>
          </div>
        </section>
      </div>
      <section className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
             <h2 className={styles.reviewsTitle}>Reviews</h2>
             {isAdmin && (
                  <Link href={`/movie/${movie.id}/add-review`} className={styles.addReviewButton}>
                   + Add Review
                 </Link>
             )}
         </div>
        {movie.reviews && movie.reviews.length > 0 ? (
          movie.reviews.map((review: Review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewUserInfo}>
                    <div className={styles.reviewAvatar}></div>
                    <span className={styles.reviewUsername}>@{review.username || `user_${review.id}`}</span>
                </div>
                <div className={styles.reviewActions}>
                    <span className={styles.reviewRating}>Rating: {review.rating}/5</span>
                    {isAdmin && (
                        <button className={styles.reviewDeleteButton}>
                            Delete
                        </button>
                    )}
                </div>
              </div>
              <p className={styles.reviewComment}>{review.text}</p>
            </div>
          ))
        ) : (
          <p>Ainda não há reviews para este filme.</p>
        )}
      </section>
    </div>
  );
}

export default MovieDetailsPage;

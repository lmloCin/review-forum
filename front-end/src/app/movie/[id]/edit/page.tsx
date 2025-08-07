"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import apiClient from '@/services/api';
import type { Movie } from '@/types/movie';
import styles from './page.module.css'; 
import { useAuth } from '@/context/AuthContext';

function EditMoviePage() {
  const params = useParams();
  const router = useRouter(); 
  const { isAdmin } = useAuth();
  const [movie, setMovie] = useState<Partial<Movie>>({});
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(true);

  const id = params?.id;

  useEffect(() => {
    if (!isAdmin) {
      router.push(`/movie/${id}`);
    }
    const fetchMovie = async () => {
      try {
        const response = await apiClient.get<Movie>(`/movies/get-by-id/${id}`);
        setMovie(response.data);
        if (response.data.tags) {
          setTagsInput(response.data.tags.join(', '));
        }
      } catch (error) {
        console.error("Erro ao buscar filme para edição:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
        fetchMovie();
    }
  }, [id, isAdmin, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovie(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (window.confirm('Tem a certeza que deseja salvar as alterações?')) {
      try {
        const movieDataToUpdate = {
            ...movie,
            tags: tagsInput.split(',').map(tag => tag.trim())
        };
        await apiClient.put(`/movies/${id}`, movieDataToUpdate);
        alert('Filme atualizado com sucesso!');
        router.push(`/movie/${id}`); 
      } catch (error) {
        console.error("Erro ao atualizar o filme:", error);
        alert('Falha ao atualizar o filme.');
      }
    }
  };

  if (loading) return <p>A carregar editor...</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Editar Filme: {movie.name}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Título*</label>
          <input type="text" id="name" name="name" value={movie.name || ''} onChange={handleChange} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="year" className={styles.label}>Ano de Lançamento*</label>
          <input type="number" id="year" name="year" value={movie.year || ''} onChange={handleChange} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="director" className={styles.label}>Diretor(es)*</label>
          <input type="text" id="director" name="director" value={movie.director || ''} onChange={handleChange} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="tags" className={styles.label}>Tags (separadas por vírgula)*</label>
          <input type="text" id="tags" name="tags" value={tagsInput} onChange={handleTagsChange} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Sinopse</label>
          <textarea id="description" name="description" value={movie.description || ''} onChange={handleChange} className={styles.textarea} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="bannerURL" className={styles.label}>Banner (URL)</label>
          <input type="text" id="bannerURL" name="bannerURL" value={movie.bannerURL || ''} onChange={handleChange} className={styles.input} />
        </div>
        <div className={styles.buttonGroup}>
          <button type="button" onClick={() => router.push(`/movie/${id}`)} className={`${styles.button} ${styles.cancelButton}`}>
            Cancelar
          </button>
          <button type="submit" className={`${styles.button} ${styles.saveButton}`}>
            Editar Filme
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditMoviePage;
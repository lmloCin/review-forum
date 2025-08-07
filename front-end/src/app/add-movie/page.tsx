"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/services/api';
import styles from './page.module.css'; 
import { useAuth } from '@/context/AuthContext';


function AddMoviePage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [movieData, setMovieData] = useState({
    name: '',
    year: '',
    director: '',
    tags: '',
    description: '',
    bannerURL: ''
  });

  useEffect(() => {
    // Redireciona se o utilizador não for admin
    if (!isAdmin) {
      router.push('/');
    }
  }, [isAdmin, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovieData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (window.confirm('Tem a certeza que deseja adicionar este filme?')) {
      try {
        const dataToSend = {
          ...movieData,
          year: Number(movieData.year),
          tags: movieData.tags.split(',').map(tag => tag.trim())
        };
        await apiClient.post('/movies', dataToSend);
        alert('Filme adicionado com sucesso!');
        router.push('/'); // Volta para a homepage
      } catch (error) {
        console.error("Erro ao adicionar o filme:", error);
        alert('Falha ao adicionar o filme.');
      }
    }
  };

  if (!isAdmin) return null; // Não renderiza nada enquanto redireciona

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Adicionar Novo Filme</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Título*</label>
          <input type="text" id="name" name="name" value={movieData.name} onChange={handleChange} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="year" className={styles.label}>Ano de Lançamento*</label>
          <input type="number" id="year" name="year" value={movieData.year} onChange={handleChange} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="director" className={styles.label}>Diretor(es)*</label>
          <input type="text" id="director" name="director" value={movieData.director} onChange={handleChange} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="tags" className={styles.label}>Tags (separadas por vírgula)*</label>
          <input type="text" id="tags" name="tags" value={movieData.tags} onChange={handleChange} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Sinopse</label>
          <textarea id="description" name="description" value={movieData.description} onChange={handleChange} className={styles.textarea} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="bannerURL" className={styles.label}>Banner (URL)</label>
          <input type="text" id="bannerURL" name="bannerURL" value={movieData.bannerURL} onChange={handleChange} className={styles.input} />
        </div>
        <div className={styles.buttonGroup}>
          <button type="button" onClick={() => router.push('/')} className={`${styles.button} ${styles.cancelButton}`}>
            Cancelar
          </button>
          <button type="submit" className={`${styles.button} ${styles.saveButton}`}>
            Adicionar Filme
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMoviePage;
"use client";

import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css'; // Importamos o ficheiro de estilos
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const { isAdmin, loginAsAdmin, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brandNav}>
          <Link href="/" className={styles.brandLink}>
            <h1 className={styles.brand}>
              Review<span className={styles.brandAccent}>Forum</span>
            </h1>
          </Link>
          <nav className={styles.nav}>
            <Link href="/">Films</Link>
            <Link href="/forum">Forum</Link>
          </nav>
        </div>
        <div className={styles.controls}>
          <input
            type="search"
            placeholder="Search..."
            className={styles.searchInput}
          />
          {isAdmin ? (
            <button onClick={logout} className={styles.loginLink}>
              Logout (Admin)
            </button>
          ) : (
            <button onClick={loginAsAdmin} className={styles.loginLink}>
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
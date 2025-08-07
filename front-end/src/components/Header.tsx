import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../context/AuthContext'; 

const Header: React.FC = () => {
  const { isAdmin, loginAsAdmin, logout } = useAuth(); 

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brandNav}>
          <Link to="/" className={styles.brandLink}>
            <h1 className={styles.brand}>
              Review<span className={styles.brandAccent}>Forum</span>
            </h1>
          </Link>
          <nav className={styles.nav}>
            <Link to="/">Films</Link>
            <a href="#">Forum</a>
          </nav>
        </div>
        <div className={styles.controls}>
          <input
            type="search"
            placeholder="Search..."
            className={styles.searchInput}
          />
          {/* Renderização condicional do botão de Login/Logout */}
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
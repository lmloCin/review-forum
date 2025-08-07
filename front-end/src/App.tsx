import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import EditMoviePage from './pages/EditMoviePage';
import AddReviewPage from './pages/AddReviewPage';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/movie/:id/edit" element={<EditMoviePage />} />
          <Route path="/movie/:id/add-review" element={<AddReviewPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

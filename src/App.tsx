import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { LogIn } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { User } from './pages/User';
import { Home } from './pages/Home';
import { PublicReviewList } from './pages/PublicReviewList';
import { Profile } from './pages/Profile';
import  { PublicReviewProvider }  from './context/PublicReviewsContext';
import { AuthProvider } from './context/AuthContext';
import { ReviewList } from './pages/ReviewList';
import { PostReview } from './pages/PostReview';
import { DetailReview } from './pages/DetailReview';
import { EditReview } from './pages/EditReview';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <PublicReviewProvider>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/user" element={<User />} />
              <Route path="/public/books" element={<PublicReviewList />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/books" element={<ReviewList />} />
              <Route path="/new" element={<PostReview />} />
              <Route path="/detail/:id" element={<DetailReview />} />
              <Route path="/edit/:id" element={<EditReview />} />
            </Routes>
          </Router>
        </PublicReviewProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App;

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { LogIn } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { User } from './pages/User';
import { Home } from './pages/Home';
import { PublicReviewList } from './pages/PublicReviewList';
function App() {
  

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user" element={<User />} />
        <Route path="/public/books" element={<PublicReviewList />} />
      </Routes>
      
    </Router>
  )
}

export default App

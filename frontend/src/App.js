// App.js
import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ResearchList from './components/ResearchList';
import Summary from './components/Sumary';
import SearchBar from './components/Info/searchbar'; 
import InfoMessage from './components/Info/info';

import Signup from './pages/Signup';
import Login from './components/Info/login';
import UserSummaries from './components/UserSummary';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
    setLoading(false);
  }, [])
  
  if (loading) return null;

  return (
    <Router>
      <InfoMessage />
      <Routes>
        {/* Protected Routes */}
        {user ? (
          <>
            <Route path="/articles" element={<ResearchList />} />
            <Route path="/viewer" element={<Summary />} />
            <Route path="/user-summaries" element={<UserSummaries />} />
          </>
        ) : (
          <>
            {/* Public Routes */}
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </>
        )
        }

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to={user ? "/articles" : "/"} />} />
      </Routes>
    </Router>
  );
}

export default App;

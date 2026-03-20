import axios from 'axios';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password
      });
      
      const data = res?.data;
      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate('/')
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.error)
      alert(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Section - Login Form */}
      <div style={styles.left}>
        <h2 style={styles.heading}>WELCOME BACK!</h2>
        <p style={styles.subText}>Log in to access your saved summaries and preferences.</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <h3 style={styles.sectionTitle}>LOGIN</h3>

          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>{loading ? 'Loading...' : 'Signin'}</button>
        </form>
      {
        error &&(
            <p style={styles.error}>
              {error}
            </p>
        )
      }
       <p style={styles.disclaimer}>
          If you don't have an account then, please click on <NavLink to='/signup'>Signup.</NavLink>
        </p>
      </div>

      {/* Right Section - Features */}
      <div style={styles.right}>
        <h3 style={styles.sectionTitle}>✅ What will you get:</h3>
        <ul style={styles.features}>
          <li>🔍 Summarize articles in seconds</li>
          <li>📚 Access to 100+ academic sources</li>
          <li>💡 Unlimited free summaries</li>
          <li>🤖 AI-enhanced suggestions</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    padding: '40px',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f9fbfd',
    minHeight: '100vh',
    justifyContent: 'center',
    gap: '40px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  left: {
    background: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    flex: 1,
    maxWidth: '480px',
    minWidth: '300px',
  },
  right: {
    padding: '20px',
    flex: 1,
    minWidth: '300px',
    maxWidth: '400px',
  },
  heading: {
    color: '#2ecc71',
    fontSize: '20px',
    marginBottom: '8px',
  },
  subText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#2ecc71',
    border: 'none',
    color: 'white',
    fontSize: '15px',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  sectionTitle: {
    marginBottom: '10px',
    color: '#333',
  },
  disclaimer: {
    marginTop: '14px',
    fontSize: '12px',
    color: '#777'
  },
  
  error: {
    marginTop: '14px',
    fontSize: '12px',
    color: 'red'
  },

  features: {
    listStyleType: 'none',
    paddingLeft: '0',
    fontSize: '15px',
    lineHeight: '2em',
    color: '#fff'
  }
};

export default Login;

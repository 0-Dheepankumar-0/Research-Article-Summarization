import axios from 'axios';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {name, email, password});
      const data = response?.data;
      if (response?.status !== 201) {
        alert(data?.error || "Signup failed!!");
        setLoading(false);
        return;
      }else{
        alert("✅ User registered Successfully")
      }

      // localStorage.setItem("token", response?.token);
      // localStorage.setItem("userEmail", response?.user?.email);
      navigate('/login');
      // onSignup(data.user.email);
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Section - Signup Form */}
      <div style={styles.left}>
        <h2 style={styles.heading}>SIGN UP FOR FREE IN LESS THAN A MINUTE</h2>
        <p style={styles.subText}>Unlimited access to research summaries in 3 easy steps:</p>

        <form onSubmit={handleSignup} style={styles.form}>
          <h3 style={styles.sectionTitle}>CREATE ACCOUNT</h3>

          <input
            type="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          
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
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating Account..." : "CREATE FREE ACCOUNT"}
          </button>
        </form>

        <p style={styles.disclaimer}>
          If you have already account then, please click on <NavLink to='/login'>Login.</NavLink>
        </p>

        {/* <p style={styles.loginLink}>
          Already have an account? <a href="/login">Log in</a>
        </p> */}
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
  loginLink: {
    marginTop: '12px',
    fontSize: '13px',
    color: '#444',
    textAlign: 'center',
  },
  features: {
    listStyleType: 'none',
    paddingLeft: '0',
    fontSize: '15px',
    lineHeight: '2em',
    color: '#fff'
  }
};

export default Signup;

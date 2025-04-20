import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const signupUser = async (e) => {
    e.preventDefault();
    const { name, email, password } = form;

    if (!name || !email || !password) {
      setError('All fields are required!');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/signup', form);
      alert('Account created!');
      navigate('/login');
    } catch (err) {
      setError('Signup failed! Try a different email.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={signupUser} style={styles.form}>
        <h2 style={styles.heading}>Sign Up</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input
          type="text"
          placeholder="Name"
          style={styles.input}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <div style={styles.passwordContainer}>
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            style={{ ...styles.input, marginBottom: 0 }}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="button" onClick={() => setShowPass(!showPass)} style={styles.toggleBtn}>
            {showPass ? 'Hide' : 'Show'}
          </button>
        </div>
        <button type="submit" style={styles.button}>Register</button>
        <p style={{ textAlign: 'center' }}>Already have an account? <button onClick={() => navigate('/login')} style={styles.linkBtn}>Login</button></p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f1f1f1'
  },
  form: {
    background: '#fff',
    padding: 30,
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    width: '90%',
    maxWidth: 400
  },
  heading: {
    marginBottom: 20,
    textAlign: 'center'
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center'
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderRadius: 4,
    border: '1px solid #ccc'
  },
  button: {
    width: '100%',
    padding: 10,
    backgroundColor: '#222',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
  },
  toggleBtn: {
    background: 'transparent',
    border: 'none',
    color: '#007BFF',
    cursor: 'pointer',
    marginTop: 5
  },
  passwordContainer: {
    marginBottom: 15
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#007BFF',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '1rem'
  }
};

export default Signup;

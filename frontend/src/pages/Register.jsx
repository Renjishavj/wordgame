import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onFileChange = e => setProfilePic(e.target.files[0]);

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const submitData = new FormData();
    submitData.append('name', name);
    submitData.append('email', email);
    submitData.append('password', password);
    if (profilePic) {
      submitData.append('profilePic', profilePic);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userName', res.data.user.name);
      setSuccess('Registration Successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="game-container">
      <h2 className="game-title">PLAYER REGISTRATION</h2>
      
      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Player Name</label>
          <input 
            type="text" 
            className="form-control" 
            name="name" 
            value={name} 
            onChange={onChange} 
            required 
            placeholder="Enter your gamertag"
          />
        </div>
        
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            className="form-control" 
            name="email" 
            value={email} 
            onChange={onChange} 
            required 
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label>Secret Password</label>
          <input 
            type="password" 
            className="form-control" 
            name="password" 
            value={password} 
            onChange={onChange} 
            required 
            placeholder="Enter your password"
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label>Avatar (Profile Pic)</label>
          <div className="file-input-wrapper">
            <div className="btn-file">
              {profilePic ? profilePic.name : 'UPLOAD IMAGE'}
            </div>
            <input 
              type="file" 
              name="profilePic" 
              onChange={onFileChange} 
              accept="image/*"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary">CREATE ACCOUNT</button>
      </form>
      
      <Link to="/login" className="switch-link">ALREADY A PLAYER? LOGIN HERE</Link>
    </div>
  );
};

export default Register;

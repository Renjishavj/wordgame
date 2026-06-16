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
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onFileChange = e => {
    setProfilePic(e.target.files[0]);
    setFormErrors(prevErrors => ({ ...prevErrors, profilePic: '' }));
  };

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Player name is required.';
    } else if (name.trim().length < 3) {
      errors.name = 'Player name must be at least 3 characters.';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (profilePic) {
      if (!/^image\//.test(profilePic.type)) {
        errors.profilePic = 'Only image files are allowed.';
      } else if (profilePic.size > 2 * 1024 * 1024) {
        errors.profilePic = 'Image size must be under 2MB.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFormErrors({});

    if (!validateForm()) {
      setError('Please fix the highlighted fields before submitting.');
      return;
    }

    const submitData = new FormData();
    submitData.append('name', name);
    submitData.append('email', email);
    submitData.append('password', password);
    if (profilePic) {
      submitData.append('profilePic', profilePic);
    }

    try {
      const res = await axios.post('https://wordgame-m15v.onrender.com/api/auth/register', submitData, {
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
            className={`form-control ${formErrors.name ? 'input-error' : ''}`}
            name="name"
            value={name}
            onChange={onChange}
            required
            placeholder="Enter your gamertag"
          />
          {formErrors.name && <div className="field-error">{formErrors.name}</div>}
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            className={`form-control ${formErrors.email ? 'input-error' : ''}`}
            name="email"
            value={email}
            onChange={onChange}
            required
            placeholder="Enter your email"
          />
          {formErrors.email && <div className="field-error">{formErrors.email}</div>}
        </div>

        <div className="form-group">
          <label>Secret Password</label>
          <input
            type="password"
            className={`form-control ${formErrors.password ? 'input-error' : ''}`}
            name="password"
            value={password}
            onChange={onChange}
            required
            placeholder="Enter your password"
            minLength="6"
          />
          {formErrors.password && <div className="field-error">{formErrors.password}</div>}
        </div>

        <div className="form-group">
          <label>Avatar (Profile Pic)</label>
          <div className="file-input-wrapper">
            <div className={`btn-file ${formErrors.profilePic ? 'input-error' : ''}`}>
              {profilePic ? profilePic.name : 'UPLOAD IMAGE'}
            </div>
            <input
              type="file"
              name="profilePic"
              onChange={onFileChange}
              accept="image/*"
            />
          </div>
          {formErrors.profilePic && <div className="field-error">{formErrors.profilePic}</div>}
        </div>

        <button type="submit" className="btn-primary">CREATE ACCOUNT</button>
      </form>

      <Link to="/login" className="switch-link">ALREADY A PLAYER? LOGIN HERE</Link>
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../api/client';

export const LoginView = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('ops@bixoo.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // url-encoded form data for OAuth2
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      
      const response = await apiClient.post('/api/v1/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      const token = response.data.access_token;
      localStorage.setItem('admin_jwt', token);
      
      // Get user details
      const userResponse = await apiClient.get('/api/v1/auth/me');
      login(userResponse.data);
      
      const from = location.state?.from?.pathname || '/admin/overview';
      navigate(from, { replace: true });
    } catch (err) {
      setError('Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-lg border border-slate-800 w-96 space-y-4">
        <h2 className="text-xl font-bold text-slate-100">BIXOO Admin Login</h2>
        {error && <div className="text-rose-400 text-sm">{error}</div>}
        <div>
          <label className="text-xs text-slate-400">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 mt-1" />
        </div>
        <div>
          <label className="text-xs text-slate-400">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 mt-1" />
        </div>
        <button type="submit" className="w-full bg-emerald-600 text-white rounded p-2 hover:bg-emerald-700 transition font-semibold mt-4">
          Login
        </button>
      </form>
    </div>
  );
};

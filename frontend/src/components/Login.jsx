import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../firebase.js';

/**
 * Login component — Real Firebase Google Sign-In
 * No mock/demo login. Role assigned by email domain.
 */
const Login = ({ role, onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await signInWithGoogle();
      const isAdmin = user.email?.includes('admin') || user.email?.endsWith('@nexusevent.com');
      const assignedRole = isAdmin ? 'admin' : (role || 'student');
      onLogin(assignedRole);
      navigate(assignedRole === 'admin' ? '/admin/events' : '/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Google Sign-In error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-transparent">
      <div className="bento-card p-10 max-w-[440px] w-full border-2 border-brand-500 dark:border-cyber-primary shadow-xl">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-brand-50 text-brand-500 dark:bg-transparent dark:text-cyber-primary rounded-2xl dark:rounded-none flex items-center justify-center mx-auto mb-4 border border-brand-100 dark:border-cyber-primary dark:shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <span className="text-3xl" aria-hidden="true">⚡</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 dark:font-mono">
            NexusEvent
          </h2>
          <p className="text-slate-500 text-sm dark:text-cyber-secondary">
            Smart Event Management Platform
          </p>
        </div>

        {error && (
          <div role="alert" className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          aria-label="Sign in with Google account"
          className="w-full flex items-center justify-center gap-3 py-4 px-6 border-2 border-slate-200 dark:border-cyber-border rounded-xl dark:rounded-none hover:bg-slate-50 dark:hover:bg-cyber-primary/5 transition-all font-semibold text-slate-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-6">
          By signing in, you agree to our Terms of Service
        </p>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-cyber-border/30 text-center">
          <span className="badge-tag text-[10px] uppercase tracking-widest">
            {role === 'admin' ? '🔒 Admin Portal' : '🎓 Student Portal'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;

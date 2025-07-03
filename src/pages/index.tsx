import { useUser } from '@/contexts/userContext';
import { useRouter } from 'next/router';
import { useState } from 'react';
import '../styles/login.css';


export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        setError(error || 'Login failed');
        return;
      }

      const userData = await res.json();
      setUser(userData);
      setError('');

      // Delay to show loading overlay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      router.push('/blogs');
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-style">
      {loading && (
        <div className='loading-container'>
          <div className='loading-text'>Loading...</div>
        </div>
      )}
      <div className='form-container'>
        <form onSubmit={handleLogin} className='form'>
          <h1>Login</h1>
          <label>Email:</label>
          <input
            className='input-styles'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password:</label>
          <input
            className='input-styles'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className='button-container'>
            <button className='button-style' type="submit">Login</button>
            <button className='button-style' type="button" onClick={() => router.push('/register')}>Register</button>
          </div>
          {error && <p className='error'>{error}</p>}
        </form>
      </div>
    </div>
  );
}

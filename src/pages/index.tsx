import { useUser } from '@/contexts/userContext';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { setUser } = useUser();

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
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

      setError('');
      const userData = await res.json();
      setUser(userData);
      router.push('/blogs');
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Try again later.');
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      <h1>Welcome!</h1>
      {loading && <p>Loading...</p>}
      <form onSubmit={handleLogin}>
        <label>Email: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password: </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => router.push('/register')}>Register Now</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  );
}

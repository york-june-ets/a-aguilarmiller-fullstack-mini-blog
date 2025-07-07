import { useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/userContext";
import '../styles/register.css'

export default function Register() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const { setUser } = useUser();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/register', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const { error } = await res.json();
                setError(error || "Registration Failed");
                return;
            }

            const newUser = await res.json();
            setUser(newUser);
            setError('');
            router.push('/blogs');
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Register</h1>
                {loading && <p>Loading...</p>}
                <label>Email:</label>
                <input
                    type="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-style"
                />
                <label>Password:</label>
                <input
                    type="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-style"
                />
                <div className="button-container">
                    <button type="submit" className="button">Submit</button>
                    <button type="button" className="button" onClick={() => router.push('/')}>Back to Login</button>
                </div>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}
import { useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/userContext";

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
        <>
            <h1>Register</h1>
            {loading && <div>Loading...</div>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email: </label>
                <input type="email" name="email" required onChange={(e) => setEmail(e.target.value)} />
                <label>Password: </label>
                <input type="password" name="password" required onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
    );
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from './_helper';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const { rows: users } = await query(
            'SELECT * FROM users WHERE email = $1 AND password = $2',
            [email, password]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Success: return the user (omit password in real app)
        const user = users[0];
        return res.status(200).json({ id: user.id, email: user.email });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
}
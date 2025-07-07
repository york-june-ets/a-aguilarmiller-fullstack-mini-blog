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
        const { rows } = await query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, password]
        );

        const newUser = rows[0];
        return res.status(201).json(newUser);
    } catch (err) {
        console.error('Registration error:', err);

        if (err instanceof Error) {
            return res.status(500).json({ error: err.message });
        }

        return res.status(500).json({ error: 'Something went wrong' });
    }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../_helper';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;
    const { title, content, userId } = req.body;

    if (!title || !content || !userId) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        const { rows } = await query(
            `UPDATE posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING *`,
            [title, content, id, userId]
        );

        if (rows.length === 0) {
            return res.status(403).json({ error: 'Unauthorized or post not found' });
        }

        return res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Error updating post:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

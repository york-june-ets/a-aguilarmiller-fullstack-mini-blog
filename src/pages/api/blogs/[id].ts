import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../_helper';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === 'PUT') {
        const { title, content, userId } = req.body;

        try {
            await query(
                `UPDATE posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING *`,
                [title, content, id, userId]
            );

            res.status(200).json({ title, content });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to update post' });
        }

    } else if (req.method === 'DELETE') {
        const { userId } = req.body;

        try {
            await query(`DELETE FROM posts WHERE id = $1 AND user_id = $2`, [id, userId]);
            res.status(200).json({ message: 'Post deleted' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete post' });
        }

    } else {
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from './_helper';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { rows: posts } = await query(`
      SELECT posts.id, posts.title, posts.content, users.email AS author
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.id DESC
    `);

        res.status(200).json(posts);
    } catch (err) {
        console.error('Failed to fetch blogs:', err);
        res.status(500).json({ error: 'Failed to load blogs' });
    }
}

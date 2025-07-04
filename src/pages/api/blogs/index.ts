import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "../_helper";

export default async function createPostHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { user_id, title, content } = req.body;

    if (!user_id || !title || !content) {
        return res.status(400).json({ error: 'Verify you are signed in, and have provided a title and content' });
    }

    try {
        const { rows } = await query(
            'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [user_id, title, content]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong while creating the post' });
    }
}

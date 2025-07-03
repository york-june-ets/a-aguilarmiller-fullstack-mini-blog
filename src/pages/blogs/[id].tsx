import { GetStaticPaths, GetStaticProps } from 'next';
import { useUser } from '@/contexts/userContext';
import { query } from '@/pages/api/_helper';
import { useState } from 'react';

interface Blog {
    id: number;
    title: string;
    content: string;
    author: string;
    user_id: number;
}

interface BlogPageProps {
    blog: Blog;
}

export default function BlogPost({ blog }: BlogPageProps) {
    const { user } = useUser();
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(blog.title);
    const [content, setContent] = useState(blog.content);
    const [error, setError] = useState('');

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/blogs/${blog.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, userId: user?.id }),
            });

            if (!res.ok) {
                const { error } = await res.json();
                setError(error);
                return;
            }

            const updated = await res.json();
            setTitle(updated.title);
            setContent(updated.content);
            setEditing(false);
        } catch (err) {
            console.error(err);
            setError('Failed to update blog');
        }
    };

    return (
        <div className='post-container'>
            {!editing ? (
                <div className='post'>
                    <h1>{title}</h1>
                    <p><em>by {blog.author}</em></p>
                    <p>{content}</p>
                    {user?.id === blog.user_id && (
                        <button onClick={() => setEditing(true)} className='edit-button'>Edit Post</button>
                    )}
                </div>
            ) : (
                <form onSubmit={handleEditSubmit} className='form'>
                    <h2>Edit Post</h2>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='input'
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={8}
                    />
                    <div className='button-container'>
                        <button type="submit">Save</button>
                        <button className='cancel-button' type="button" onClick={() => setEditing(false)}>Cancel</button>
                    </div>
                    {error && <p className='error'>{error}</p>}
                </form>
            )}
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const { rows } = await query('SELECT id FROM posts');
    const paths = rows.map((post: { id: number }) => ({ params: { id: post.id.toString() } }));

    return {
        paths,
        fallback: 'blocking',
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { id } = params as { id: string };

    const { rows } = await query(
        `SELECT posts.id, posts.title, posts.content, posts.user_id, users.email AS author FROM posts
     JOIN users ON posts.user_id = users.id
     WHERE posts.id = $1`,
        [id]
    );

    if (!rows[0]) return { notFound: true };

    return {
        props: { blog: rows[0] },
        revalidate: 10,
    };
}

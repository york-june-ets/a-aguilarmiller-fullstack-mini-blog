import { GetStaticPaths, GetStaticProps } from 'next';
import { query } from '@/pages/api/_helper';
import { useState } from 'react';
import Post from '@/components/blogs/Post';
import EditPost from '@/components/blogs/EditPost';


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
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(blog.title);
    const [content, setContent] = useState(blog.content);
    const [error, setError] = useState('');

    const editPostProps = {
        title, blog, content, setEditing, setError
    }

    const postProps = {
        blog, title, setTitle, content, setContent, setEditing, setError, error
    }


    return (
        <div className='post-container'>
            {!editing ? (
                <EditPost {...editPostProps} />
            ) : (
                <Post {...postProps} />
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

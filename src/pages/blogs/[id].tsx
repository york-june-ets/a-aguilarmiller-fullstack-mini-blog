import { GetStaticPaths, GetStaticProps } from 'next';
import { query } from '@/pages/api/_helper';
import { Blog } from '../../../types/types';
import { useState } from 'react';
import Post from '@/components/blogs/Post';
import EditPost from '@/components/blogs/EditPost';

interface BlogPageProps {
    blog: Blog;
}

export default function BlogPost({ blog }: BlogPageProps) {
    const [editing, setEditing] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(blog.title);
    const [content, setContent] = useState<string>(blog.content);
    const [error, setError] = useState<string>('');

    const postProps = {
        title, blog, content, setEditing, setError
    }

    const editPostProps = {
        blog, title, setTitle, content, setContent, setEditing, setError, error
    }


    return (
        <div className='post-container'>
            {!editing ? (
                <Post {...postProps} />
            ) : (
                <EditPost {...editPostProps} />
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
        `SELECT posts.id, posts.title, posts.content, posts.createdOn AS "createdOn", posts.user_id, users.email AS author FROM posts
     JOIN users ON posts.user_id = users.id
     WHERE posts.id = $1`,
        [id]
    );

    if (!rows[0]) return { notFound: true };

    const blog = {
        ...rows[0],
        createdOn: rows[0].createdOn.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }),
    }

    return {
        props: { blog },
        revalidate: 10,
    };
}

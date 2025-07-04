import { GetStaticProps } from "next";
import Link from "next/link";
import { query } from "../api/_helper";
import { useUser } from "@/contexts/userContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BlogPageProps } from "../../../types/types";
import '../../styles/blogs.css';

export default function BlogMainPage({ blogs }: BlogPageProps) {
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [createPost, setCreatePost] = useState(false);
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    if (!user) return <div>Loading...</div>;

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/blogs', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.id, title, content }),
            });

            if (!res.ok) {
                const { error } = await res.json();
                setError(error || 'Failed to create post');
                return;
            }

            const newPost = await res.json();
            router.push(`/blogs/${newPost.id}`);

        } catch (err) {
            console.error(err);
            setError('Failed to create post');
        }
    };

    return (
        <div className="container">
            <button className="button" onClick={() => setCreatePost(true)}>New Post</button>
            <h1>The Latest</h1>

            {createPost && (
                <form onSubmit={handleCreatePost} className='form'>
                    <h2>Create Post</h2>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='input'
                        placeholder="Post title"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={8}
                        placeholder="Write your content here..."
                    />
                    <div className='button-container'>
                        <button className="button" type="submit">Save</button>
                        <button
                            className='button'
                            type="button"
                            onClick={() => {
                                setCreatePost(false);
                                setTitle('');
                                setContent('');
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                    {error && <p className='error'>{error}</p>}
                </form>
            )}

            <div className="card-container">
                {blogs.map((blog, index) => (
                    <div
                        key={blog.id}
                        className="card-item"
                        onMouseEnter={(e) => {
                            const card = e.currentTarget;
                            card.style.backgroundColor = '#fff';
                            card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            const card = e.currentTarget;
                            card.style.backgroundColor = '#d8c4b6';
                            card.style.boxShadow = 'none';
                        }}
                    >
                        <img
                            src={PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length]}
                            alt={blog.title}
                            className="card-image"
                        />
                        <h2>{blog.title}</h2>
                        <p>Sample small text. Lorem ipsum dolor sit amet.</p>
                        <Link href={`/blogs/${blog.id}`}>
                            <button className="button">Read More</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

const PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    "https://img.freepik.com/premium-photo/sunset-beach-background-png-aesthetic-transparent-design_53876-1029940.jpg",
    "https://images.unsplash.com/photo-1530103043960-ef38714abb15?fm=jpg&q=60&w=3000",
    "https://i.pinimg.com/736x/5d/3a/b4/5d3ab4df7b9b3b33a620e39dc7a34d54.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIU8HVLEPnmmodwWzCVPhV6UvsaQpZFLErxw&s",
    "https://s.studiobinder.com/wp-content/uploads/2021/02/Natural-light-%E2%80%94-Aesthetic-pictures-of-people.jpg"
];

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
    const { rows } = await query(`
    SELECT posts.id, posts.title, posts.content, users.email AS author
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.id DESC
  `);

    return {
        props: {
            blogs: rows,
        },
        revalidate: 10,
    };
};



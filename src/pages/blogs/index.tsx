import { GetStaticProps } from "next";
import { query } from "../api/_helper";
import { useUser } from "@/contexts/userContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BlogPageProps } from "../../../types/types";
import '../../styles/blogs.css';
import CreatePost from "@/components/blogs/CreatePost";
import BlogList from "@/components/blogs/BlogList";

export default function BlogMainPage({ blogs }: BlogPageProps) {
    const [error, setError] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [createPost, setCreatePost] = useState<boolean>(false);
    const { user, setUser } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    if (!user) return <div>Loading...</div>;


    const postFormProps = {
        title,
        setTitle,
        content,
        setContent,
        error,
        setError,
        createPost,
        setCreatePost,
    };

    return (
        <div className="container">
            <div className="button-container">
                <button className="button" onClick={() => setCreatePost(true)}>New Post</button>
                <button className="button" onClick={() => setUser(null)}>Log out</button>
            </div>
            <h1>The Latest</h1>
            <CreatePost {...postFormProps} />
            <BlogList blogs={blogs} />
        </div>
    );
}



export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
    const { rows } = await query(`
    SELECT posts.id, posts.title, posts.content, posts.createdOn AS "createdOn", users.email AS author
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.id DESC
  `);


    const blogs = rows.map((blog) => ({
        ...blog,
        createdOn: blog.createdOn.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }),
    }))

    return {
        props: {
            blogs,
        },
        revalidate: 10,
    };
};



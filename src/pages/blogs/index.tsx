import { GetStaticProps } from "next";
import Link from "next/link";
import { query } from "../api/_helper";
import { useUser } from "@/contexts/userContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { BlogPageProps } from "@/types/types";

export default function BlogMainPage({ blogs }: BlogPageProps) {
    const { user } = useUser()
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/')
        }
    }, [user, router])

    if (!user) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
            <h1>All Blog Posts</h1>
            <ul>
                {blogs.map((blog) => (
                    <li key={blog.id}>
                        <Link href={`/blogs/${blog.id}`}>
                            <strong>{blog.title}</strong> by {blog.author}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
}

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
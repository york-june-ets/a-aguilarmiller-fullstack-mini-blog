import { GetStaticProps } from "next";
import Link from "next/link";
import { query } from "../api/_helper";
import { useUser } from "@/contexts/userContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { BlogPageProps } from "../../../types/types";
import '../../styles/blogs.css'

export default function BlogMainPage({ blogs }: BlogPageProps) {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container">
            <h1>The Latest</h1>
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
                            <button className="button">
                                Read More
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

const PLACEHOLDER_IMAGES = [
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/edb005e4-13cd-41a6-99cc-03bdff0198a4/ddw80u0-d2d2b4e1-9c31-4df4-94ad-3e5ed0e8d8ab.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2VkYjAwNWU0LTEzY2QtNDFhNi05OWNjLTAzYmRmZjAxOThhNFwvZGR3ODB1MC1kMmQyYjRlMS05YzMxLTRkZjQtOTRhZC0zZTVlZDBlOGQ4YWIuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.J40gUeAZH_CNH57smLgNxBGJW_8ld-fXMYUvPYwMGek",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    "https://img.freepik.com/premium-photo/sunset-beach-background-png-aesthetic-transparent-design_53876-1029940.jpg?semt=ais_hybrid&w=740",
    "https://images.unsplash.com/photo-1530103043960-ef38714abb15?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWVzdGhldGljfGVufDB8fDB8fHww",
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

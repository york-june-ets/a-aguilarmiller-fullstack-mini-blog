export type Blog = {
    id: number;
    title: string;
    content: string;
    author: string;
};

export type BlogPageProps = {
    blogs: Blog[];
};
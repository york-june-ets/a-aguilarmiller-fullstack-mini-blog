export type Blog = {
    id: number;
    title: string;
    content: string;
    author: string;
    createdOn: Date;
};

export type BlogPageProps = {
    blogs: Blog[];
};
import { ReactNode } from "react";

export type Blog = {
    id: number;
    user_id: number;
    title: string;
    content: string;
    author: string;
    createdOn: ReactNode;
};

export type BlogPageProps = {
    blogs: Blog[];
};
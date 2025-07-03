import { Dispatch, SetStateAction } from "react";

export interface User {
    id: number;
    email: string;
    password: string;
}

export interface UserContextType {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}